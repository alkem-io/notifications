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
import { UserPreferenceType } from '@alkemio/client-lib';

@Injectable()
export class UserRegisteredNotificationBuilder {
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

  async buildNotifications(eventPayload: UserRegistrationEventPayload) {
    this.logger.verbose?.(
      `[Notifications: userRegistration]: ${JSON.stringify(eventPayload)}`,
      LogContext.NOTIFICATIONS
    );
    // Get additional data
    const registrant = await this.alkemioAdapter.getUser(eventPayload.userID);

    const adminNotificationPromises = await this.buildNotificationsForRole(
      eventPayload,
      'admin',
      EmailTemplate.USER_REGISTRATION_ADMIN,
      registrant,
      UserPreferenceType.NotificationUserSignUp
    );

    const registrantNotificationPromises = await this.buildNotificationsForRole(
      eventPayload,
      'registrant',
      EmailTemplate.USER_REGISTRATION_REGISTRANT,
      registrant
    );

    return Promise.all([
      ...adminNotificationPromises,
      ...registrantNotificationPromises,
    ]);
  }

  async buildNotificationsForRole(
    eventPayload: UserRegistrationEventPayload,
    recipientRole: string,
    emailTemplate: EmailTemplate,
    registrant: User,
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
      this.buildNotification(eventPayload, recipient, emailTemplate, registrant)
    );

    Promise.all(notifications);
    this.logger.verbose?.(
      `Notifications [${emailTemplate}] - completed for ${notifications.length} recipients.`,
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
