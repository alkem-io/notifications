import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import NotifmeSdk, { NotificationStatus } from 'notifme-sdk';
import {
  ALKEMIO_CLIENT_ADAPTER,
  LogContext,
  NOTIFICATIONS_PROVIDER,
} from '@src/common';
import { ApplicationCreatedEventPayload } from '@src/types/application.created.event.payload';
import { ApplicationCreatedNotificationBuilder } from '@src/services';
import { CommunicationDiscussionCreatedNotificationBuilder } from '../builders/communication-discussion-created/communication.discussion.created.notification.builder';
import { CommunicationUpdateNotificationBuilder } from '../builders/communication-updated/communication.updated.notification.builder';
import { UserRegisteredNotificationBuilder } from '../builders/user-registered/user.registered.notification.builder';
import { UserRegistrationEventPayload } from '@src/types';
import { CommunicationUpdateEventPayload } from '@src/types/communication.update.event.payload';
import { CommunicationDiscussionCreatedEventPayload } from '@src/types/communication.discussion.created.event.payload';
import { AlkemioClientAdapter } from '@src/services/application/alkemio-client-adapter';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(ALKEMIO_CLIENT_ADAPTER)
    private readonly alkemioClientAdapter: AlkemioClientAdapter,
    @Inject(NOTIFICATIONS_PROVIDER)
    private readonly notifmeService: NotifmeSdk,
    private applicationCreatedNotificationBuilder: ApplicationCreatedNotificationBuilder,
    private userRegisteredNotificationBuilder: UserRegisteredNotificationBuilder,
    private communicationUpdatedNotificationBuilder: CommunicationUpdateNotificationBuilder,
    private communicationDiscussionCreatedNotificationBuilder: CommunicationDiscussionCreatedNotificationBuilder
  ) {}

  async sendNotifications(
    payload: any,
    notificationBuilder: any
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    const notificationsEnabled =
      await this.alkemioClientAdapter.areNotificationsEnabled();
    if (!notificationsEnabled) {
      this.logger.verbose?.(
        'Notification disabled. No notifications are going to be built.',
        LogContext.NOTIFICATIONS
      );

      return [];
    }

    return notificationBuilder
      .buildNotifications(payload)
      .then((x: any[]) => x.map((x: any) => this.sendNotification(x)))
      .then((x: any) => Promise.allSettled(x));
  }

  async sendApplicationCreatedNotifications(
    payload: ApplicationCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.applicationCreatedNotificationBuilder
    );
  }

  async sendUserRegisteredNotification(
    payload: UserRegistrationEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.userRegisteredNotificationBuilder
    );
  }

  async sendCommunicationUpdatedNotification(
    payload: CommunicationUpdateEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.communicationUpdatedNotificationBuilder
    );
  }

  async sendCommunicationDiscussionCreatedNotification(
    payload: CommunicationDiscussionCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.communicationDiscussionCreatedNotificationBuilder
    );
  }

  private async sendNotification(
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
