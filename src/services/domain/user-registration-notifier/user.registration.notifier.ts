import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  ALKEMIO_CLIENT_ADAPTER,
  LogContext,
  NOTIFICATION_RECIPIENTS_YML_ADAPTER,
  TEMPLATE_PROVIDER,
} from '@src/common';
import { NotificationTemplateBuilder } from '@src/services/external/notifme/notification.templates.builder';
import {
  INotificationRecipientTemplateProvider,
  INotifiedUsersProvider,
} from '@core/contracts';
import { User, CredentialCriteria } from '@core/models';
import { ApplicationCreatedEventPayload } from '@src/types/application.created.event.payload';
import { ruleToCredential } from '../../application/template-to-credential-mapper/utils/utils';
import { EmailTemplate } from '@src/common/enums/email.template';

@Injectable()
export class UserRegistrationNotifier {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(ALKEMIO_CLIENT_ADAPTER)
    private readonly notifiedUsersService: INotifiedUsersProvider,
    @Inject(TEMPLATE_PROVIDER)
    private readonly notificationTemplateBuilder: NotificationTemplateBuilder,
    @Inject(NOTIFICATION_RECIPIENTS_YML_ADAPTER)
    private readonly recipientTemplateProvider: INotificationRecipientTemplateProvider
  ) {}

  async sendNotifications(eventPayload: any) {
    // Get additional data
    const registrant = await this.notifiedUsersService.getUser(
      eventPayload.registrant
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
    eventPayload: any,
    recipientRole: string,
    emailTemplate: EmailTemplate,
    registrant: User
  ) {
    this.logger.verbose?.(
      `Notifications [${emailTemplate}] - recipients role: '${recipientRole}`,
      LogContext.NOTIFICATIONS
    );
    const credentialCriterias = this.getCredentialCriterias(
      eventPayload,
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

  // toDo:
  // 1. Move getRecipients back to the credential mapper. Logically, it has nothing to do with this service.
  // 2. Decide on a design how to get a template, either have the template with named sections, or create callbacks to get the specific template or...
  // 3. Abstract ApplicationCreatedEventPayload. Create base payload.
  // 4. Use the abstraction of the payload in the getRecipients. The format of what is needed in the credential mapper is quite fixed and the rules are strongly types - we know what we need.
  public getCredentialCriterias(
    payload: ApplicationCreatedEventPayload,
    roleName: string
  ): CredentialCriteria[] {
    const applicationCreatedTemplate =
      this.recipientTemplateProvider.getTemplate().user_registration;

    if (!applicationCreatedTemplate) {
      return [];
    }

    const ruleSetForRole = applicationCreatedTemplate.find(
      templateRuleSet => templateRuleSet.name === roleName
    );

    if (!ruleSetForRole) {
      this.logger.error(`Unable to identify rule set for role: ${roleName}`);
      return [];
    }

    const rules = ruleSetForRole.rules;

    return rules.map(x => ruleToCredential(x, payload));
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
        email: registrant.email,
      },
      recipient: {
        name: recipient.displayName,
        email: recipient.email,
      },
      event: eventPayload,
    };
  }
}
