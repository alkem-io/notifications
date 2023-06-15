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
  PlatformForumDiscussionCreatedEventPayload,
  CommunicationUserMessageEventPayload,
  CommunicationOrganizationMessageEventPayload,
  CommunicationCommunityLeadsMessageEventPayload,
  CommunicationUserMentionEventPayload,
  CommunicationOrganizationMentionEventPayload,
  CollaborationContextReviewSubmittedPayload,
  PlatformUserRegistrationEventPayload,
  CommunityNewMemberPayload,
  CollaborationPostCreatedEventPayload,
  CollaborationPostCommentEventPayload,
  CollaborationInterestPayload,
  CollaborationCalloutPublishedEventPayload,
  BaseEventPayload,
  PlatformUserRemovedEventPayload,
  CollaborationWhiteboardCreatedEventPayload,
  CollaborationDiscussionCommentEventPayload,
  PlatformForumDiscussionCommentEventPayload,
  CommunityInvitationCreatedEventPayload,
  CommentReplyEventPayload,
} from '@alkemio/notifications-lib';
import { AlkemioClientAdapter } from '@src/services/application/alkemio-client-adapter';
import { NotificationTemplateType } from '@src/types/notification.template.type';
import { INotificationBuilder } from '@core/contracts';
import {
  CommunityApplicationCreatedNotificationBuilder,
  PlatformForumDiscussionCreatedNotificationBuilder,
  CommunicationUpdateCreatedNotificationBuilder,
  PlatformUserRegisteredNotificationBuilder,
  PlatformForumDiscussionCommentNotificationBuilder,
  CollaborationContextReviewSubmittedNotificationBuilder,
  CollaborationPostCreatedNotificationBuilder,
  CollaborationPostCommentNotificationBuilder,
  CollaborationInterestNotificationBuilder as CollaborationInterestNotificationBuilder,
  CollaborationCalloutPublishedNotificationBuilder,
  CommunityNewMemberNotificationBuilder,
  CommunicationUserMessageNotificationBuilder,
  CommunicationOrganizationMessageNotificationBuilder,
  CommunicationCommunityLeadsMessageNotificationBuilder,
  CommunicationUserMentionNotificationBuilder,
  CommunicationOrganizationMentionNotificationBuilder,
  CommunityInvitationCreatedNotificationBuilder,
} from '../builders';
import { NotificationNoChannelsException } from '@src/common/exceptions';
import { PlatformUserRemovedNotificationBuilder } from '../builders/platform-user-removed/platform.user.removed.notification.builder';
import { CollaborationWhiteboardCreatedNotificationBuilder } from '../builders/collaboration-whiteboard-created/collaboration.whiteboard.created.notification.builder';
import { CollaborationDiscussionCommentNotificationBuilder } from '../builders/collaboration-discussion-comment/collaboration.discussion.comment.notification.builder';
import { CommentReplyNotificationBuilder } from '../builders/comment-reply/comment.reply.notification.builder';

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
    private communityInvitationCreatedNotificationBuilder: CommunityInvitationCreatedNotificationBuilder,
    private platformUserRegisteredNotificationBuilder: PlatformUserRegisteredNotificationBuilder,
    private platformUserRemovedNotificationBuilder: PlatformUserRemovedNotificationBuilder,
    private platformForumDiscussionCommentNotificationBuilder: PlatformForumDiscussionCommentNotificationBuilder,
    private communicationUpdatedNotificationBuilder: CommunicationUpdateCreatedNotificationBuilder,
    private communicationDiscussionCreatedNotificationBuilder: PlatformForumDiscussionCreatedNotificationBuilder,
    private communicationUserMessageNotificationBuilder: CommunicationUserMessageNotificationBuilder,
    private communicationOrganizationMessageNotificationBuilder: CommunicationOrganizationMessageNotificationBuilder,
    private communicationCommunityLeadsMessageNotificationBuilder: CommunicationCommunityLeadsMessageNotificationBuilder,
    private communicationUserMentionNotificationBuilder: CommunicationUserMentionNotificationBuilder,
    private communicationOrganizationMentionNotificationBuilder: CommunicationOrganizationMentionNotificationBuilder,
    private collaborationContextReviewSubmittedNotificationBuilder: CollaborationContextReviewSubmittedNotificationBuilder,
    private communityNewMemberNotificationBuilder: CommunityNewMemberNotificationBuilder,
    private collaborationWhiteboardCreatedNotificationBuilder: CollaborationWhiteboardCreatedNotificationBuilder,
    private collaborationPostCreatedNotificationBuilder: CollaborationPostCreatedNotificationBuilder,
    private collaborationPostCommentNotificationBuilder: CollaborationPostCommentNotificationBuilder,
    private collaborationCalloutPublishedNotificationBuilder: CollaborationCalloutPublishedNotificationBuilder,
    private collaborationDiscussionCommentNotificationBuilder: CollaborationDiscussionCommentNotificationBuilder,
    private collaborationInterestNotificationBuilder: CollaborationInterestNotificationBuilder,
    private commentReplyNotificationBuilder: CommentReplyNotificationBuilder
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

  async sendInvitationCreatedNotifications(
    payload: CommunityInvitationCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.communityInvitationCreatedNotificationBuilder
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

  async sendPlatformForumDiscussionCreatedNotification(
    payload: PlatformForumDiscussionCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.communicationDiscussionCreatedNotificationBuilder
    );
  }

  async sendPlatformForumDiscussionCommentNotification(
    payload: PlatformForumDiscussionCommentEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.platformForumDiscussionCommentNotificationBuilder
    );
  }

  async sendCommunicationUserMessageNotification(
    payload: CommunicationUserMessageEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.communicationUserMessageNotificationBuilder
    );
  }

  async sendCommunicationOrganizationMessageNotification(
    payload: CommunicationOrganizationMessageEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.communicationOrganizationMessageNotificationBuilder
    );
  }

  async sendCommunicationCommunityLeadsMessageNotification(
    payload: CommunicationCommunityLeadsMessageEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.communicationCommunityLeadsMessageNotificationBuilder
    );
  }

  async sendCommunicationUserMentionNotification(
    payload: CommunicationUserMentionEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.communicationUserMentionNotificationBuilder
    );
  }

  async sendCommunicationOrganizationMentionNotification(
    payload: CommunicationOrganizationMentionEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.communicationOrganizationMentionNotificationBuilder
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

  async sendPostCreatedNotification(
    payload: CollaborationPostCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.collaborationPostCreatedNotificationBuilder
    );
  }

  async sendWhiteboardCreatedNotification(
    payload: CollaborationWhiteboardCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.collaborationWhiteboardCreatedNotificationBuilder
    );
  }

  async sendPostCommentCreatedNotification(
    payload: CollaborationPostCommentEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.collaborationPostCommentNotificationBuilder
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

  async sendCommentReplyNotification(
    payload: CommentReplyEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.commentReplyNotificationBuilder
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
