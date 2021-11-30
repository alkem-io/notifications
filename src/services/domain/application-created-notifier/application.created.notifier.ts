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
import { User } from '@core/models';
import { ApplicationCreatedEventPayload } from '@src/types/application.created.event.payload';
import { ruleToCredential } from '../../application/template-to-credential-mapper/utils/utils';
import { CredentialCriteria } from '@src/core/models/credential.criteria';
import { EmailTemplate } from '@src/common/enums/email.template';

@Injectable()
export class ApplicationCreatedNotifier {
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
    const applicant = await this.notifiedUsersService.getUser(
      eventPayload.applicant
    );

    await this.sendNotificationsForRole(
      eventPayload,
      'admin',
      EmailTemplate.USER_APPLICATION_ADMIN,
      applicant
    );

    await this.sendNotificationsForRole(
      eventPayload,
      'applicant',
      EmailTemplate.USER_APPLICATION_APPLICANT,
      applicant
    );
  }

  async sendNotificationsForRole(
    eventPayload: any,
    recipientRole: string,
    emailTemplate: EmailTemplate,
    registrant: User
  ) {
    this.logger.verbose?.(
      `Notifications [${emailTemplate}] - role '${recipientRole}`,
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
      `Notifications [${recipientRole}] - completed`,
      LogContext.NOTIFICATIONS
    );
  }

  async buildNotification(
    eventPayload: any,
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

  // toDo:
  // 1. Move getRecipients back to the credential mapper. Logically, it has nothing to do with this service.
  public getCredentialCriterias(
    payload: ApplicationCreatedEventPayload,
    roleName: string
  ): CredentialCriteria[] {
    const applicationCreatedTemplate =
      this.recipientTemplateProvider.getTemplate().application_created;

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
    applicant: User
  ): any {
    return {
      emailFrom: 'info@alkem.io',
      applicant: {
        name: applicant.displayName,
        email: applicant.email,
      },
      recipient: {
        name: recipient.displayName,
        email: recipient.email,
      },
      community: {
        name: eventPayload.community.name,
        type: eventPayload.community.type,
      },
      event: eventPayload,
    };
  }
}
