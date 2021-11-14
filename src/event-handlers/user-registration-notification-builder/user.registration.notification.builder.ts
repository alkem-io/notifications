import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  ALKEMIO_CLIENT_ADAPTER,
  LogContext,
  NOTIFICATION_RECIPIENTS_YML_ADAPTER,
  TEMPLATE_PROVIDER,
} from '@src/common';
import { NotificationTemplateBuilder } from '@src/wrappers/notifme/notification.templates.builder';
import {
  INotificationRecipientTemplateProvider,
  INotifiedUsersProvider,
  RecipientCredential,
} from '@core/contracts';
import { User } from '@core/models';
import { ApplicationCreatedEventPayload } from '@src/types/application.created.event.payload';
import { ruleToCredential } from '../../services/template-to-credential-mapper/utils/utils';

@Injectable()
export class UserRegistrationNotificationBuilder {
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

  async buildNotifications(payload: any): Promise<any[]> {
    const adminCredentials = this.getApplicationCreatedRecipients(
      payload,
      'admin'
    );

    // const applicantsCredentials =
    //   this.notificationReceivers.getApplicationCreatedRecipients(
    //     payload,
    //     'applicants'
    //   );

    const applicant = await this.notifiedUsersService.getApplicant(payload);

    const adminRequests = adminCredentials.map(credential =>
      this.notifiedUsersService.getUsersMatchingCredentialCriteria(
        credential.type,
        credential.resourceID
      )
    );

    const settledAdminUsers = await Promise.allSettled(adminRequests);

    const adminUsers: User[] = [];
    settledAdminUsers.forEach(x => {
      if (x.status === 'fulfilled') {
        adminUsers.push(...x.value);
      } else {
        this.logger.error(
          `Could not fetch admin users: ${x.reason}`,
          LogContext.NOTIFICATIONS
        );
      }
    });

    const adminNotifications = adminUsers.map(x =>
      this.buildAdminNotification(payload, applicant, x)
    );

    // todo what to do with the applicant field in the template??
    // todo: need to send a message to all users configured to receive the applicants email; cannot assume it is just one.

    const applicantNotification = this.buildUserNotification(
      payload,
      applicant
    );

    // will resolve on the first rejection or when all are resolved normally
    return Promise.all([...adminNotifications, applicantNotification]);
  }

  buildUserNotification(payload: any, applicant: User) {
    const mergedUserPayload = getBaseNotification(payload, applicant);

    return this.buildNotification(
      mergedUserPayload,
      'user.registration.registrant'
    );
  }

  buildAdminNotification(payload: any, applicant: User, admin: User) {
    const mergedAdminPayload = getBaseNotification(payload, applicant) as any;
    mergedAdminPayload.admin = {
      firstname: admin.firstName,
      email: admin.email,
    };

    return this.buildNotification(
      mergedAdminPayload,
      'user.registration.admin'
    );
  }

  buildNotification = (payload: any, templateName: string) =>
    this.notificationTemplateBuilder.buildTemplate(templateName, payload);

  public getApplicationCreatedRecipients(
    payload: ApplicationCreatedEventPayload,
    roleName: string
  ): RecipientCredential[] {
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
}

const getBaseNotification = (payload: any, applicant: User) => ({
  emailFrom: 'info@alkem.io',
  applicant: {
    name: applicant.displayName,
    email: applicant.email,
  },
  community: {
    name: payload.community.name,
    type: payload.community.type,
  },
});
