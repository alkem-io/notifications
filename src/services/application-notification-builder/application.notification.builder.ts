import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  ALKEMIO_CLIENT_ADAPTER,
  LogContext,
  TEMPLATE_PROVIDER,
} from '@src/common';
import { NotificationTemplateBuilder } from '@src/wrappers/notifme/notification.templates.builder';
import {
  INotificationRecipientProvider,
  INotifiedUsersProvider,
} from '@core/contracts';
import { NotificationReceiversYml } from '../notification-receiver-yml/notification.receivers.yml.service';
import { User } from '@core/models';

@Injectable()
export class ApplicationNotificationBuilder {
  constructor(
    @Inject(NotificationReceiversYml)
    private readonly notificationReceivers: INotificationRecipientProvider,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(ALKEMIO_CLIENT_ADAPTER)
    private readonly notifiedUsersService: INotifiedUsersProvider,
    @Inject(TEMPLATE_PROVIDER)
    private readonly notificationTemplateBuilder: NotificationTemplateBuilder
  ) {}

  async buildNotifications(payload: any): Promise<any[]> {
    const receiverCredentials =
      this.notificationReceivers.getApplicationCreatedRecipients(payload);

    const applicant = await this.notifiedUsersService.getApplicant(payload);

    const adminRequests = receiverCredentials
      .filter(x => x.isAdmin)
      .map(({ role, resourceID }) =>
        this.notifiedUsersService.getUsersWithCredentials(role, resourceID)
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
      'user.application.applicant'
    );
  }

  buildAdminNotification(payload: any, applicant: User, admin: User) {
    const mergedAdminPayload = getBaseNotification(payload, applicant) as any;
    mergedAdminPayload.admin = {
      firstname: admin.firstName,
      email: admin.email,
    };

    return this.buildNotification(mergedAdminPayload, 'user.application.admin');
  }

  buildNotification = (payload: any, templateName: string) =>
    this.notificationTemplateBuilder.buildTemplate(templateName, payload);
}

const getBaseNotification = (payload: any, applicant: User) => ({
  emailFrom: '<info@alkem.io>',
  applicant: {
    name: applicant.displayName,
    email: applicant.email,
  },
  community: {
    name: payload.community.name,
    type: payload.community.type,
  },
});
