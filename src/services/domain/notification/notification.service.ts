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
import { CommunityContextReviewSubmittedPayload } from '@src/types/community.context.review.submitted.payload';
import { CommunityContextReviewSubmittedNotificationBuilder } from '../builders/community-context-feedback/community.context.review.submitted.notification.builder';
import { NotificationTemplateType } from '@src/types/notification.template.type';

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
    private communicationDiscussionCreatedNotificationBuilder: CommunicationDiscussionCreatedNotificationBuilder,
    private communityContextReviewSubmittedNotificationBuilder: CommunityContextReviewSubmittedNotificationBuilder
  ) {}

  async sendNotifications(
    payload: Record<string, unknown>,
    notificationBuilder: any // todo INotificationBuilder
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
    // todo: after the notificationBuilder interface is defined remove the any type
    return notificationBuilder
      .build(payload)
      .then((x: any[]) => x.map((x: any) => this.sendNotification(x)))
      .then((x: any) => Promise.allSettled(x))
      .catch((error: Error) => this.logger.error(error.message));
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

  async sendCommunityContextFeedbackNotification(
    payload: CommunityContextReviewSubmittedPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.communityContextReviewSubmittedNotificationBuilder
    );
  }

  private async sendNotification(
    notification: NotificationTemplateType
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
