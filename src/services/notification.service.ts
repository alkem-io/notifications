import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import NotifmeSdk, { NotificationStatus } from 'notifme-sdk';
import {
  LogContext,
  NOTIFICATIONS_PROVIDER,
  TEMPLATE_PROVIDER,
} from '@src/common';
import { NotificationTemplateService } from '@src/wrappers/notifme/notifme.templates.service';
import { ApplicationNotificationBuilder } from './application.notification.builder';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(NOTIFICATIONS_PROVIDER)
    private readonly notifmeService: NotifmeSdk,
    @Inject(TEMPLATE_PROVIDER)
    private readonly templateService: NotificationTemplateService,
    private readonly applicationNotificationBuilder: ApplicationNotificationBuilder
  ) {}

  async sendNotification(payload: any): Promise<NotificationStatus> {
    const notification = await this.templateService.renderTemplate(
      'welcome',
      payload
    );

    try {
      const notificationStatus = await this.notifmeService.send(
        notification.channels
      );
      this.logger.verbose?.(
        `Notification status: ${notificationStatus.status}`,
        LogContext.NOTIFICATIONS
      );

      return notificationStatus;
    } catch (error) {
      throw error;
    }
  }

  async sendApplicationNotifications(
    payload: any
  ): Promise<NotificationStatus[]> {
    const notificationStatuses = [];
    const notifications =
      await this.applicationNotificationBuilder.buildNotifications(payload);

    for (const notification of notifications) {
      notificationStatuses.push(
        await this.sendApplicationNotification(notification)
      );
    }
    return notificationStatuses;
  }

  private async sendApplicationNotification(
    notification: any
  ): Promise<NotificationStatus> {
    const notificationStatus = await this.notifmeService.send(
      notification.channels
    );
    this.logger.verbose?.(
      `Notification status: ${notificationStatus.status}`,
      LogContext.NOTIFICATIONS
    );

    return notificationStatus;
  }
}
