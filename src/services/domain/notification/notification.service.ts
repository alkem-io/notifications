import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import NotifmeSdk, { NotificationStatus } from 'notifme-sdk';
import {
  ALKEMIO_CLIENT_ADAPTER,
  LogContext,
  NotificationNoChannelsException,
  NOTIFICATIONS_PROVIDER,
} from '@src/common';
import {
  ApplicationCreatedEventPayload,
  CommunicationUpdateEventPayload,
  CommunicationDiscussionCreatedEventPayload,
  CommunityContextReviewSubmittedPayload,
  UserRegistrationEventPayload,
  CommunityNewMemberPayload,
  AspectCreatedEventPayload,
} from '@common/dto';
import { ApplicationCreatedNotificationBuilder } from '@src/services';
import { CommunicationDiscussionCreatedNotificationBuilder } from '../builders/communication-discussion-created/communication.discussion.created.notification.builder';
import { CommunicationUpdateCreatedNotificationBuilder } from '../builders/communication-update-created/communication.update.created.notification.builder';
import { UserRegisteredNotificationBuilder } from '../builders/user-registered/user.registered.notification.builder';
import { CommunityContextReviewSubmittedNotificationBuilder } from '../builders/community-context-feedback/community.context.review.submitted.notification.builder';
import { AlkemioClientAdapter } from '@src/services/application/alkemio-client-adapter';
import { NotificationTemplateType } from '@src/types/notification.template.type';
import { INotificationBuilder } from '@core/contracts';
import { CommunityNewMemberNotificationBuilder } from '@src/services/domain/builders';

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
    private communicationUpdatedNotificationBuilder: CommunicationUpdateCreatedNotificationBuilder,
    private communicationDiscussionCreatedNotificationBuilder: CommunicationDiscussionCreatedNotificationBuilder,
    private communityContextReviewSubmittedNotificationBuilder: CommunityContextReviewSubmittedNotificationBuilder,
    private communityNewMemberNotificationBuilder: CommunityNewMemberNotificationBuilder
  ) {}

  async sendNotifications(
    payload: Record<string, unknown>,
    notificationBuilder: INotificationBuilder
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
      .build(payload)
      .then(x => x.map(y => this.sendNotification(y)))
      .then(x => Promise.allSettled(x))
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

  async sendCommunityNewMemberNotifications(
    payload: CommunityNewMemberPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.communityNewMemberNotificationBuilder
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

  async sendAspectCreatedNotification(
    payload: AspectCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(payload, {});
  }

  private async sendNotification(
    notification: NotificationTemplateType
  ): Promise<NotificationStatus> {
    if (!Object.keys(notification.channels).length) {
      throw new NotificationNoChannelsException(
        `Notification (${notification.name}) - (${notification.title}) no channels provided`
      );
    }

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
