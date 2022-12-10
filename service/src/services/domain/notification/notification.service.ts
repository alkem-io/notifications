import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import NotifmeSdk, { NotificationStatus } from 'notifme-sdk';
import {
  ALKEMIO_CLIENT_ADAPTER,
  LogContext,
  NOTIFICATIONS_PROVIDER,
} from '@common/enums';
import {
  CommunityApplicationCreatedEventPayload,
  CommunicationUpdateEventPayload,
  CommunicationDiscussionCreatedEventPayload,
  CollaborationContextReviewSubmittedPayload,
  PlatformUserRegistrationEventPayload,
  CommunityNewMemberPayload,
  CollaborationCardCreatedEventPayload,
  CollaborationCardCommentEventPayload,
  CollaborationInterestPayload,
  CollaborationCalloutPublishedEventPayload,
  BaseEventPayload,
  PlatformUserRemovedEventPayload,
  CollaborationCanvasCreatedEventPayload,
  CollaborationDiscussionCommentEventPayload,
} from '@alkemio/notifications-lib';
import { AlkemioClientAdapter } from '@src/services/application/alkemio-client-adapter';
import { NotificationTemplateType } from '@src/types/notification.template.type';
import { INotificationBuilder } from '@core/contracts';
import {
  CommunityApplicationCreatedNotificationBuilder,
  CommunicationDiscussionCreatedNotificationBuilder,
  CommunicationUpdateCreatedNotificationBuilder,
  PlatformUserRegisteredNotificationBuilder,
  CollaborationContextReviewSubmittedNotificationBuilder,
  CollaborationCardCreatedNotificationBuilder,
  CollaborationCardCommentNotificationBuilder,
  CollaborationInterestNotificationBuilder as CollaborationInterestNotificationBuilder,
  CollaborationCalloutPublishedNotificationBuilder,
  CommunityNewMemberNotificationBuilder,
} from '../builders';
import { NotificationNoChannelsException } from '@src/common/exceptions';
import { PlatformUserRemovedNotificationBuilder } from '../builders/platform-user-removed/platform.user.removed.notification.builder';
import { CollaborationCanvasCreatedNotificationBuilder } from '../builders/collaboration-canvas-created/collaboration.canvas.created.notification.builder';
import { CollaborationDiscussionCommentNotificationBuilder } from '../builders/collaboration-discussion-comment/collaboration.discussion.comment.notification.builder';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(ALKEMIO_CLIENT_ADAPTER)
    private readonly alkemioClientAdapter: AlkemioClientAdapter,
    @Inject(NOTIFICATIONS_PROVIDER)
    private readonly notifmeService: NotifmeSdk,
    private communityApplicationCreatedNotificationBuilder: CommunityApplicationCreatedNotificationBuilder,
    private platformUserRegisteredNotificationBuilder: PlatformUserRegisteredNotificationBuilder,
    private platformUserRemovedNotificationBuilder: PlatformUserRemovedNotificationBuilder,
    private communicationUpdatedNotificationBuilder: CommunicationUpdateCreatedNotificationBuilder,
    private communicationDiscussionCreatedNotificationBuilder: CommunicationDiscussionCreatedNotificationBuilder,
    private collaborationContextReviewSubmittedNotificationBuilder: CollaborationContextReviewSubmittedNotificationBuilder,
    private communityNewMemberNotificationBuilder: CommunityNewMemberNotificationBuilder,
    private collaborationCanvasCreatedNotificationBuilder: CollaborationCanvasCreatedNotificationBuilder,
    private collaborationCardCreatedNotificationBuilder: CollaborationCardCreatedNotificationBuilder,
    private collaborationCardCommentNotificationBuilder: CollaborationCardCommentNotificationBuilder,
    private collaborationCalloutPublishedNotificationBuilder: CollaborationCalloutPublishedNotificationBuilder,
    private collaborationDiscussionCommentNotificationBuilder: CollaborationDiscussionCommentNotificationBuilder,
    private collaborationInterestNotificationBuilder: CollaborationInterestNotificationBuilder
  ) {}

  async sendNotifications(
    payload: BaseEventPayload,
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
    payload: CommunityApplicationCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.communityApplicationCreatedNotificationBuilder
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
    payload: PlatformUserRegistrationEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.platformUserRegisteredNotificationBuilder
    );
  }

  async sendUserRemovedNotification(
    payload: PlatformUserRemovedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.platformUserRemovedNotificationBuilder
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
    payload: CollaborationContextReviewSubmittedPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.collaborationContextReviewSubmittedNotificationBuilder
    );
  }

  async sendAspectCreatedNotification(
    payload: CollaborationCardCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.collaborationCardCreatedNotificationBuilder
    );
  }

  async sendCanvasCreatedNotification(
    payload: CollaborationCanvasCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.collaborationCanvasCreatedNotificationBuilder
    );
  }

  async sendAspectCommentCreatedNotification(
    payload: CollaborationCardCommentEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.collaborationCardCommentNotificationBuilder
    );
  }

  async sendDiscussionCommentCreatedNotification(
    payload: CollaborationDiscussionCommentEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.collaborationDiscussionCommentNotificationBuilder
    );
  }

  async sendCalloutPublishedNotification(
    payload: CollaborationCalloutPublishedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.collaborationCalloutPublishedNotificationBuilder
    );
  }

  async sendCommunityCollaborationInterestNotification(
    payload: CollaborationInterestPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.collaborationInterestNotificationBuilder
    );
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
