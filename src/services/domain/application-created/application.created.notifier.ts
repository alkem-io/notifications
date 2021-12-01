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

@Injectable()
export class ApplicationCreatedNotifier {
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

  async sendNotifications(eventPayload: ApplicationCreatedEventPayload) {
    // Get additional data
    const applicant = await this.alkemioAdapter.getUser(
      eventPayload.applicantID
    );

    const adminNotificationPromises = await this.sendNotificationsForRole(
      eventPayload,
      'admin',
      EmailTemplate.USER_APPLICATION_ADMIN,
      applicant
    );

    const applicantNotificationPromises = await this.sendNotificationsForRole(
      eventPayload,
      'applicant',
      EmailTemplate.USER_APPLICATION_APPLICANT,
      applicant
    );
    return [...adminNotificationPromises, ...applicantNotificationPromises];
  }

  async sendNotificationsForRole(
    eventPayload: any,
    recipientRole: string,
    emailTemplate: EmailTemplate,
    registrant: User
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

    this.logger.verbose?.(
      `Notifications [${emailTemplate}] - identified ${recipients.length} recipients`,
      LogContext.NOTIFICATIONS
    );

    const notifications = recipients.map(recipient =>
      this.buildNotification(eventPayload, recipient, emailTemplate, registrant)
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
    registrant: User
  ): Promise<any> {
    const templatePayload = this.createTemplatePayload(
      eventPayload,
      recipient,
      registrant
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
      eventPayload.hub.id,
      eventPayload.hub.challenge?.id,
      eventPayload.hub.challenge?.opportunity?.id
    );
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
