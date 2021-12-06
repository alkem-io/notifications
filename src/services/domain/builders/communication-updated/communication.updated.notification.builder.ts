import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  ALKEMIO_CLIENT_ADAPTER,
  ALKEMIO_URL_GENERATOR,
  ConfigurationTypes,
  LogContext,
  NOTIFICATION_RECIPIENTS_YML_ADAPTER,
  TEMPLATE_PROVIDER,
} from '@src/common';
import { NotificationTemplateBuilder } from '@src/services/external/notifme/notification.templates.builder';
import { INotificationRecipientTemplateProvider } from '@core/contracts';
import { User } from '@core/models';
import { EmailTemplate } from '@src/common/enums/email.template';
import { ConfigService } from '@nestjs/config';
import { CommunicationUpdateEventPayload } from '@src/types/communication.update.event.payload';
import { AlkemioClientAdapter } from '@src/services';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator';
import { UserPreferenceType } from '@alkemio/client-lib';

@Injectable()
export class CommunicationUpdateNotificationBuilder {
  webclientEndpoint: string;
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(ALKEMIO_CLIENT_ADAPTER)
    private readonly alkemioAdapter: AlkemioClientAdapter,
    @Inject(ALKEMIO_URL_GENERATOR)
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    @Inject(TEMPLATE_PROVIDER)
    private readonly notificationTemplateBuilder: NotificationTemplateBuilder,
    @Inject(NOTIFICATION_RECIPIENTS_YML_ADAPTER)
    private readonly recipientTemplateProvider: INotificationRecipientTemplateProvider,
    private configService: ConfigService
  ) {
    this.webclientEndpoint = this.configService.get(
      ConfigurationTypes.ALKEMIO
    )?.webclient_endpoint;
  }

  async buildNotifications(eventPayload: CommunicationUpdateEventPayload) {
    this.logger.verbose?.(
      `[Notifications: communication update]: ${JSON.stringify(eventPayload)}`,
      LogContext.NOTIFICATIONS
    );
    // Get additional data
    const sender = await this.alkemioAdapter.getUser(
      eventPayload.update.createdBy
    );

    const adminNotificationPromises = await this.buildNotificationsForRole(
      eventPayload,
      'admin',
      EmailTemplate.COMMUNICATION_UPDATE_ADMIN,
      sender
    );

    const memberNotificationPromises = await this.buildNotificationsForRole(
      eventPayload,
      'member',
      EmailTemplate.COMMUNICATION_UPDATE_MEMBER,
      sender,
      UserPreferenceType.NotificationCommunicationUpdates
    );

    return Promise.all([
      ...adminNotificationPromises,
      ...memberNotificationPromises,
    ]);
  }

  async buildNotificationsForRole(
    eventPayload: CommunicationUpdateEventPayload,
    recipientRole: string,
    emailTemplate: EmailTemplate,
    sender: User,
    preferenceType?: UserPreferenceType
  ): Promise<any> {
    this.logger.verbose?.(
      `Notifications [${emailTemplate}] - recipients role: '${recipientRole}`,
      LogContext.NOTIFICATIONS
    );
    // Get the lookup map
    const lookupMap = this.createLookupMap(eventPayload);
    const userRegistrationRuleSets =
      this.recipientTemplateProvider.getTemplate().user_registered;

    const credentialCriterias =
      this.recipientTemplateProvider.getCredentialCriterias(
        lookupMap,
        userRegistrationRuleSets,
        recipientRole
      );

    const recipients =
      await this.alkemioAdapter.getUniqueUsersMatchingCredentialCriteria(
        credentialCriterias
      );

    const filteredRecipients: User[] = [];
    for (const recipient of recipients) {
      if (recipient.preferences) {
        if (
          !preferenceType ||
          recipient.preferences.find(
            preference =>
              preference.definition.group === 'Notification' &&
              preference.definition.type === preferenceType &&
              preference.value === 'true'
          )
        )
          filteredRecipients.push(recipient);
      }
    }

    this.logger.verbose?.(
      `Notifications [${emailTemplate}] - identified ${filteredRecipients.length} recipients`,
      LogContext.NOTIFICATIONS
    );

    const notifications = filteredRecipients.map(recipient =>
      this.buildNotification(eventPayload, recipient, emailTemplate, sender)
    );

    Promise.all(notifications);
    this.logger.verbose?.(
      `Notifications [${emailTemplate}] - completed`,
      LogContext.NOTIFICATIONS
    );
    return notifications;
  }

  async buildNotification(
    eventPayload: any,
    recipient: User,
    templateName: string,
    sender: User
  ) {
    const templatePayload = this.createTemplatePayload(
      eventPayload,
      recipient,
      sender
    ) as any;

    return await this.notificationTemplateBuilder.buildTemplate(
      templateName,
      templatePayload
    );
  }

  createLookupMap(
    payload: CommunicationUpdateEventPayload
  ): Map<string, string> {
    const lookupMap: Map<string, string> = new Map();
    lookupMap.set('hubID', payload.hub.id);
    lookupMap.set('challengeID', payload.hub.challenge?.id || '');
    lookupMap.set(
      'opportunityID',
      payload.hub.challenge?.opportunity?.id || ''
    );
    return lookupMap;
  }

  createTemplatePayload(
    eventPayload: CommunicationUpdateEventPayload,
    recipient: User,
    sender: User
  ): any {
    const communityURL = this.alkemioUrlGenerator.createCommunityURL(
      eventPayload.hub.nameID,
      eventPayload.hub.challenge?.nameID,
      eventPayload.hub.challenge?.opportunity?.nameID
    );
    const senderProfile = this.alkemioUrlGenerator.createUserURL(sender.nameID);
    return {
      emailFrom: 'info@alkem.io',
      sender: {
        name: sender.displayName,
        firstname: sender.firstName,
        email: sender.email,
        profile: senderProfile,
      },
      update: {
        id: eventPayload.update.id,
      },
      recipient: {
        name: recipient.displayName,
        firstname: recipient.firstName,
        email: recipient.email,
      },
      community: {
        name: eventPayload.community.name,
        type: eventPayload.community.type,
        url: communityURL,
      },
      event: eventPayload,
    };
  }
}
