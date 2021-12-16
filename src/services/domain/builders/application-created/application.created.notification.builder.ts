import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  ALKEMIO_CLIENT_ADAPTER,
  ALKEMIO_URL_GENERATOR,
  LogContext,
  NOTIFICATION_RECIPIENTS_YML_ADAPTER,
  TEMPLATE_PROVIDER,
} from '@src/common';
import { NotificationTemplateBuilder } from '@src/services/external/notifme/notification.templates.builder';
import { INotificationRecipientTemplateProvider } from '@core/contracts';
import { User } from '@core/models';
import { ApplicationCreatedEventPayload } from '@src/types/application.created.event.payload';
import { EmailTemplate } from '@src/common/enums/email.template';
import { AlkemioClientAdapter } from '@src/services';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator';
import { UserPreferenceType } from '@alkemio/client-lib';

@Injectable()
export class ApplicationCreatedNotificationBuilder {
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
    private readonly recipientTemplateProvider: INotificationRecipientTemplateProvider
  ) {}

  async buildNotifications(eventPayload: ApplicationCreatedEventPayload) {
    // Get additional data
    const applicant = await this.alkemioAdapter.getUser(
      eventPayload.applicantID
    );

    const adminNotificationPromises = await this.buildNotificationsForRole(
      eventPayload,
      'admin',
      EmailTemplate.USER_APPLICATION_ADMIN,
      applicant,
      UserPreferenceType.NotificationApplicationReceived
    );

    const applicantNotificationPromises = await this.buildNotificationsForRole(
      eventPayload,
      'applicant',
      EmailTemplate.USER_APPLICATION_APPLICANT,
      applicant,
      UserPreferenceType.NotificationApplicationSubmitted
    );
    return Promise.all([
      ...adminNotificationPromises,
      ...applicantNotificationPromises,
    ]);
  }

  async buildNotificationsForRole(
    eventPayload: any,
    recipientRole: string,
    emailTemplate: EmailTemplate,
    applicant: User,
    preferenceType: UserPreferenceType
  ): Promise<any> {
    this.logger.verbose?.(
      `Notifications [${emailTemplate}] - role '${recipientRole}`,
      LogContext.NOTIFICATIONS
    );
    // Get the lookup map
    const lookupMap = this.createLookupMap(eventPayload);
    const applicationCreatedRuleSets =
      this.recipientTemplateProvider.getTemplate().application_created;

    const credentialCriterias =
      this.recipientTemplateProvider.getCredentialCriterias(
        lookupMap,
        applicationCreatedRuleSets,
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
      this.buildNotification(eventPayload, recipient, emailTemplate, applicant)
    );

    Promise.all(notifications);
    this.logger.verbose?.(
      `Notifications [${recipientRole}] - completed`,
      LogContext.NOTIFICATIONS
    );
    return notifications;
  }

  async buildNotification(
    eventPayload: ApplicationCreatedEventPayload,
    recipient: User,
    templateName: string,
    applicant: User
  ): Promise<any> {
    const templatePayload = this.createTemplatePayload(
      eventPayload,
      recipient,
      applicant
    ) as any;

    return await this.notificationTemplateBuilder.buildTemplate(
      templateName,
      templatePayload
    );
  }

  createLookupMap(
    payload: ApplicationCreatedEventPayload
  ): Map<string, string> {
    const lookupMap: Map<string, string> = new Map();
    lookupMap.set('applicantID', payload.applicantID);
    lookupMap.set('hubID', payload.hub.id);
    lookupMap.set('challengeID', payload.hub.challenge?.id || '');
    lookupMap.set(
      'opportunityID',
      payload.hub.challenge?.opportunity?.id || ''
    );
    return lookupMap;
  }

  createTemplatePayload(
    eventPayload: ApplicationCreatedEventPayload,
    recipient: User,
    applicant: User
  ): any {
    const applicantProfileURL = this.alkemioUrlGenerator.createUserURL(
      applicant.nameID
    );
    const communityURL = this.alkemioUrlGenerator.createCommunityURL(
      eventPayload.hub.nameID,
      eventPayload.hub.challenge?.nameID,
      eventPayload.hub.challenge?.opportunity?.nameID
    );
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(
        recipient.nameID
      );
    const hubURL = this.alkemioUrlGenerator.createHubURL();
    return {
      emailFrom: 'info@alkem.io',
      applicant: {
        name: applicant.displayName,
        email: applicant.email,
        profile: applicantProfileURL,
      },
      recipient: {
        name: recipient.displayName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      community: {
        name: eventPayload.community.name,
        type: eventPayload.community.type,
        url: communityURL,
      },
      hub: {
        url: hubURL,
      },
      event: eventPayload,
    };
  }
}
