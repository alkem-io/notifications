import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import NotifmeSdk, { NotificationStatus } from 'notifme-sdk';
import { LogContext, NOTIFICATIONS_PROVIDER } from '@src/common';
import { ApplicationNotificationBuilder } from '../application-notification-builder/application.notification.builder';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(NOTIFICATIONS_PROVIDER)
    private readonly notifmeService: NotifmeSdk,
    private readonly applicationNotificationBuilder: ApplicationNotificationBuilder
  ) {}

  async sendApplicationNotifications(
    payload: any
  ): Promise<NotificationStatus[]> {
    const notificationStatuses = [];
    const notifications =
      await this.applicationNotificationBuilder.buildNotifications(payload);

    for (const notification of notifications) {
      notificationStatuses.push(this.sendApplicationNotification(notification));
    }
    return Promise.all(notificationStatuses);
  }

  private async sendApplicationNotification(
    notification: any
  ): Promise<NotificationStatus> {
    return this.notifmeService.send(notification.channels).then(res => {
      this.logger.verbose?.(
        `Notification status: ${res.status}`,
        LogContext.NOTIFICATIONS
      );
      return res;
    });
  }
}
