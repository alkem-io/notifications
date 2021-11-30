import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  ALKEMIO_CLIENT_ADAPTER,
  ConfigurationTypes,
  LogContext,
  NOTIFICATION_RECIPIENTS_YML_ADAPTER,
  TEMPLATE_PROVIDER,
} from '@src/common';
import { NotificationTemplateBuilder } from '@src/services/external/notifme/notification.templates.builder';
import {
  INotificationRecipientTemplateProvider,
  INotifiedUsersProvider,
} from '@core/contracts';
import { User } from '@core/models';
import { EmailTemplate } from '@src/common/enums/email.template';
import { ConfigService } from '@nestjs/config';
import { UserRegistrationEventPayload } from '@src/types/user.registration.event.payload';

@Injectable()
export class UserRegistrationNotifier {
  webclientEndpoint: string;
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(ALKEMIO_CLIENT_ADAPTER)
    private readonly notifiedUsersService: INotifiedUsersProvider,
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

  async sendNotifications(eventPayload: UserRegistrationEventPayload) {
    // Get additional data
    const registrant = await this.notifiedUsersService.getUser(
      eventPayload.userID
    );

    await this.sendNotificationsForRole(
      eventPayload,
      'admin',
      EmailTemplate.USER_REGISTRATION_ADMIN,
      registrant
    );

    await this.sendNotificationsForRole(
      eventPayload,
      'registrant',
      EmailTemplate.USER_REGISTRATION_REGISTRANT,
      registrant
    );
  }

  async sendNotificationsForRole(
    eventPayload: UserRegistrationEventPayload,
    recipientRole: string,
    emailTemplate: EmailTemplate,
    registrant: User
  ) {
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
      await this.notifiedUsersService.getUniqueUsersMatchingCredentialCriteria(
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
    return {
      emailFrom: 'info@alkem.io',
      registrant: {
        name: registrant.displayName,
        firstname: registrant.firstName,
        email: registrant.email,
        profile: `${this.webclientEndpoint}/user/${registrant.nameID}`,
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
