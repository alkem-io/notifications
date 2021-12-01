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
import { EmailTemplate } from '@src/common/enums/email.template';
import { UserRegistrationEventPayload } from '@src/types/user.registration.event.payload';
import { AlkemioClientAdapter } from '@src/services';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator';

@Injectable()
export class UserRegistrationNotifier {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(ALKEMIO_CLIENT_ADAPTER)
    private alkemioAdapter: AlkemioClientAdapter,
    @Inject(ALKEMIO_URL_GENERATOR)
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    @Inject(TEMPLATE_PROVIDER)
    private readonly notificationTemplateBuilder: NotificationTemplateBuilder,
    @Inject(NOTIFICATION_RECIPIENTS_YML_ADAPTER)
    private readonly recipientTemplateProvider: INotificationRecipientTemplateProvider
  ) {}

  async sendNotifications(eventPayload: UserRegistrationEventPayload) {
    this.logger.verbose?.(
      `[Notifications: userRegistration]: ${JSON.stringify(eventPayload)}`,
      LogContext.NOTIFICATIONS
    );
    // Get additional data
    const registrant = await this.alkemioAdapter.getUser(eventPayload.userID);

    const adminNotificationPromises = await this.sendNotificationsForRole(
      eventPayload,
      'admin',
      EmailTemplate.USER_REGISTRATION_ADMIN,
      registrant
    );

    const registrantNotificationPromises = await this.sendNotificationsForRole(
      eventPayload,
      'registrant',
      EmailTemplate.USER_REGISTRATION_REGISTRANT,
      registrant
    );

    return [...adminNotificationPromises, ...registrantNotificationPromises];
  }

  async sendNotificationsForRole(
    eventPayload: UserRegistrationEventPayload,
    recipientRole: string,
    emailTemplate: EmailTemplate,
    registrant: User
  ): Promise<any> {
    this.logger.verbose?.(
      `Notifications [${emailTemplate}] - recipients role: '${recipientRole}`,
      LogContext.NOTIFICATIONS
    );
    // Get the lookup map
    const lookupMap = this.createLookupMap(eventPayload);
    const userRegistrationRuleSets =
      this.recipientTemplateProvider.getTemplate().user_registration;

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

    this.logger.verbose?.(
      `Notifications [${emailTemplate}] - identified ${recipients.length} recipients`,
      LogContext.NOTIFICATIONS
    );

    const notifications = recipients.map(recipient =>
      this.buildNotification(eventPayload, recipient, emailTemplate, registrant)
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
    registrant: User
  ) {
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

  createLookupMap(payload: UserRegistrationEventPayload): Map<string, string> {
    const lookupMap: Map<string, string> = new Map();
    lookupMap.set('registrantID', payload.userID);
    return lookupMap;
  }

  createTemplatePayload(
    eventPayload: any,
    recipient: User,
    registrant: User
  ): any {
    const registrantProfileURL = this.alkemioUrlGenerator.createUserURL(
      registrant.nameID
    );
    return {
      emailFrom: 'info@alkem.io',
      registrant: {
        name: registrant.displayName,
        firstname: registrant.firstName,
        email: registrant.email,
        profile: registrantProfileURL,
      },
      recipient: {
        name: recipient.displayName,
        firstname: recipient.firstName,
        email: recipient.email,
      },
      event: eventPayload,
    };
  }
}
