import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import NotifmeSdk, { NotificationStatus } from 'notifme-sdk';
import { LogContext, NOTIFICATIONS_PROVIDER } from '@src/common';
import { ApplicationNotificationBuilder } from '../application-notification-builder/application.notification.builder';
import { ApplicationCreatedEventPayload } from '@src/types';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(NOTIFICATIONS_PROVIDER)
    private readonly notifmeService: NotifmeSdk,
    private readonly applicationNotificationBuilder: ApplicationNotificationBuilder
  ) {}

  sendApplicationNotifications(
    payload: ApplicationCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.applicationNotificationBuilder
      .buildNotifications(payload)
      .then(x => x.map(x => this.sendApplicationNotification(x)))
      .then(x => Promise.allSettled(x));
  }

  private sendApplicationNotification(
    notification: any
  ): Promise<NotificationStatus> {
    return this.notifmeService.send(notification.channels).then(
      res => {
        this.logger.verbose?.(
          `Notification status: ${res.status}`,
          LogContext.NOTIFICATIONS
        );
        return res;
      },
      reason => {
        this.logger.verbose?.(
          `Notification rejected with reason: ${reason}`,
          LogContext.NOTIFICATIONS
        );
        return reason;
      }
    );
  }
}
