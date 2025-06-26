import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import NotifmeSdk, { NotificationStatus } from 'notifme-sdk';
import {
  ALKEMIO_CLIENT_ADAPTER,
  ConfigurationTypes,
  LogContext,
  NOTIFICATIONS_PROVIDER,
} from '@common/enums';
import {
  BaseEventPayload,
  CollaborationCalloutPublishedEventPayload,
  CollaborationDiscussionCommentEventPayload,
  CollaborationPostCommentEventPayload,
  CollaborationPostCreatedEventPayload,
  CollaborationWhiteboardCreatedEventPayload,
  CommentReplyEventPayload,
  CommunicationCommunityLeadsMessageEventPayload,
  CommunicationOrganizationMentionEventPayload,
  CommunicationOrganizationMessageEventPayload,
  CommunicationUpdateEventPayload,
  CommunicationUserMentionEventPayload,
  CommunicationUserMessageEventPayload,
  CommunityApplicationCreatedEventPayload,
  CommunityInvitationCreatedEventPayload,
  CommunityInvitationVirtualContributorCreatedEventPayload,
  CommunityNewMemberPayload,
  CommunityPlatformInvitationCreatedEventPayload,
  PlatformForumDiscussionCommentEventPayload,
  PlatformForumDiscussionCreatedEventPayload,
  PlatformGlobalRoleChangeEventPayload,
  PlatformUserRegistrationEventPayload,
  PlatformUserRemovedEventPayload,
  SpaceCreatedEventPayload,
} from '@alkemio/notifications-lib';
import { AlkemioClientAdapter } from '@src/services/application/alkemio-client-adapter';
import { NotificationTemplateType } from '@src/types/notification.template.type';
import { INotificationBuilder } from '@core/contracts';
import {
  CollaborationCalloutPublishedNotificationBuilder,
  CollaborationPostCommentNotificationBuilder,
  CollaborationPostCreatedNotificationBuilder,
  CommunicationCommunityLeadsMessageNotificationBuilder,
  CommunicationOrganizationMentionNotificationBuilder,
  CommunicationOrganizationMessageNotificationBuilder,
  CommunicationUpdateCreatedNotificationBuilder,
  CommunicationUserMentionNotificationBuilder,
  CommunicationUserMessageNotificationBuilder,
  CommunityApplicationCreatedNotificationBuilder,
  CommunityInvitationCreatedNotificationBuilder,
  CommunityNewMemberNotificationBuilder,
  CommunityPlatformInvitationCreatedNotificationBuilder,
  PlatformForumDiscussionCommentNotificationBuilder,
  PlatformForumDiscussionCreatedNotificationBuilder,
  PlatformUserRegisteredNotificationBuilder,
} from '../builders';
import { NotificationNoChannelsException } from '@src/common/exceptions';
import { PlatformUserRemovedNotificationBuilder } from '../builders/platform-user-removed/platform.user.removed.notification.builder';
import { CollaborationWhiteboardCreatedNotificationBuilder } from '../builders/collaboration-whiteboard-created/collaboration.whiteboard.created.notification.builder';
import { CollaborationDiscussionCommentNotificationBuilder } from '../builders/collaboration-discussion-comment/collaboration.discussion.comment.notification.builder';
import { CommentReplyNotificationBuilder } from '../builders/comment-reply/comment.reply.notification.builder';
import { PlatformGlobalRoleChangeNotificationBuilder } from '../builders/platform-global-role-change/platform.global.role.change.notification.builder';
import { CommunityInvitationVirtualContributorCreatedNotificationBuilder } from '../builders/community-invitation-virtual-contributor-created/community.invitation.virtual.contributor.created.notification.builder';
import { SpaceCreatedNotificationBuilder } from '../builders/space-created/space.created.notification.builder';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(ALKEMIO_CLIENT_ADAPTER)
    private readonly alkemioClientAdapter: AlkemioClientAdapter,
    @Inject(NOTIFICATIONS_PROVIDER)
    private readonly notifmeService: NotifmeSdk,
    private readonly configService: ConfigService,
    private communityApplicationCreatedNotificationBuilder: CommunityApplicationCreatedNotificationBuilder,
    private communityInvitationCreatedNotificationBuilder: CommunityInvitationCreatedNotificationBuilder,
    private communityPlatformInvitationCreatedNotificationBuilder: CommunityPlatformInvitationCreatedNotificationBuilder,
    private platformGlobalRoleChangeNotificationBuilder: PlatformGlobalRoleChangeNotificationBuilder,
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
    private communityNewMemberNotificationBuilder: CommunityNewMemberNotificationBuilder,
    private collaborationWhiteboardCreatedNotificationBuilder: CollaborationWhiteboardCreatedNotificationBuilder,
    private collaborationPostCreatedNotificationBuilder: CollaborationPostCreatedNotificationBuilder,
    private collaborationPostCommentNotificationBuilder: CollaborationPostCommentNotificationBuilder,
    private collaborationCalloutPublishedNotificationBuilder: CollaborationCalloutPublishedNotificationBuilder,
    private collaborationDiscussionCommentNotificationBuilder: CollaborationDiscussionCommentNotificationBuilder,
    private commentReplyNotificationBuilder: CommentReplyNotificationBuilder,
    private communityInvitationvirtualContributorCreatedNotificationBuilder: CommunityInvitationVirtualContributorCreatedNotificationBuilder,
    private spaceCreatedNotificationBuilder: SpaceCreatedNotificationBuilder
  ) {}

  async sendApplicationCreatedNotifications(
    payload: CommunityApplicationCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.buildAndSend(
      payload,
      this.communityApplicationCreatedNotificationBuilder
    );
  }

  async sendInvitationCreatedNotifications(
    payload: CommunityInvitationCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.buildAndSend(
      payload,
      this.communityInvitationCreatedNotificationBuilder
    );
  }

  async sendVirtualContributorInvitationCreatedNotifications(
    payload: CommunityInvitationVirtualContributorCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.buildAndSend(
      payload,
      this.communityInvitationvirtualContributorCreatedNotificationBuilder
    );
  }

  async sendCommunityPlatformInvitationCreatedNotifications(
    payload: CommunityPlatformInvitationCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.buildAndSend(
      payload,
      this.communityPlatformInvitationCreatedNotificationBuilder
    );
  }

  async sendCommunityNewMemberNotifications(
    payload: CommunityNewMemberPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.buildAndSend(
      payload,
      this.communityNewMemberNotificationBuilder
    );
  }

  async sendGlobalRoleChangeNotification(
    payload: PlatformGlobalRoleChangeEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.buildAndSend(
      payload,
      this.platformGlobalRoleChangeNotificationBuilder
    );
  }

  async sendUserRegisteredNotification(
    payload: PlatformUserRegistrationEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.buildAndSend(
      payload,
      this.platformUserRegisteredNotificationBuilder
    );
  }

  async sendUserRemovedNotification(
    payload: PlatformUserRemovedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.buildAndSend(
      payload,
      this.platformUserRemovedNotificationBuilder
    );
  }

  async sendCommunicationUpdatedNotification(
    payload: CommunicationUpdateEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.buildAndSend(
      payload,
      this.communicationUpdatedNotificationBuilder
    );
  }

  async sendPlatformForumDiscussionCreatedNotification(
    payload: PlatformForumDiscussionCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.buildAndSend(
      payload,
      this.communicationDiscussionCreatedNotificationBuilder
    );
  }

  async sendPlatformForumDiscussionCommentNotification(
    payload: PlatformForumDiscussionCommentEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.buildAndSend(
      payload,
      this.platformForumDiscussionCommentNotificationBuilder
    );
  }

  async sendCommunicationUserMessageNotification(
    payload: CommunicationUserMessageEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.buildAndSend(
      payload,
      this.communicationUserMessageNotificationBuilder
    );
  }

  async sendCommunicationOrganizationMessageNotification(
    payload: CommunicationOrganizationMessageEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.buildAndSend(
      payload,
      this.communicationOrganizationMessageNotificationBuilder
    );
  }

  async sendCommunicationCommunityLeadsMessageNotification(
    payload: CommunicationCommunityLeadsMessageEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.buildAndSend(
      payload,
      this.communicationCommunityLeadsMessageNotificationBuilder
    );
  }

  async sendCommunicationUserMentionNotification(
    payload: CommunicationUserMentionEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.buildAndSend(
      payload,
      this.communicationUserMentionNotificationBuilder
    );
  }

  async sendCommunicationOrganizationMentionNotification(
    payload: CommunicationOrganizationMentionEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.buildAndSend(
      payload,
      this.communicationOrganizationMentionNotificationBuilder
    );
  }

  async sendPostCreatedNotification(
    payload: CollaborationPostCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.buildAndSend(
      payload,
      this.collaborationPostCreatedNotificationBuilder
    );
  }

  async sendWhiteboardCreatedNotification(
    payload: CollaborationWhiteboardCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.buildAndSend(
      payload,
      this.collaborationWhiteboardCreatedNotificationBuilder
    );
  }

  async sendPostCommentCreatedNotification(
    payload: CollaborationPostCommentEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.buildAndSend(
      payload,
      this.collaborationPostCommentNotificationBuilder
    );
  }

  async sendDiscussionCommentCreatedNotification(
    payload: CollaborationDiscussionCommentEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.buildAndSend(
      payload,
      this.collaborationDiscussionCommentNotificationBuilder
    );
  }

  async sendCalloutPublishedNotification(
    payload: CollaborationCalloutPublishedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.buildAndSend(
      payload,
      this.collaborationCalloutPublishedNotificationBuilder
    );
  }

  async sendCommentReplyNotification(
    payload: CommentReplyEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.buildAndSend(payload, this.commentReplyNotificationBuilder);
  }

  async buildAndSendSpaceCreatedNotification(
    payload: SpaceCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.buildAndSend(payload, this.spaceCreatedNotificationBuilder);
  }

  private async buildAndSend(
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

    const notifications = await notificationBuilder.build(payload);

    try {
      return Promise.allSettled(
        notifications.map(x => this.sendNotification(x))
      );
    } catch (error: any) {
      this.logger.error(error.message);
    }
    return [];
  }

  private async sendNotification(
    notification: NotificationTemplateType
  ): Promise<NotificationStatus> {
    if (!Object.keys(notification.channels).length) {
      throw new NotificationNoChannelsException(
        `Notification (${notification.name}) - (${notification.title}) no channels provided`
      );
    }
    // since this is the only channel we have; log an error if it's not provided
    if (!notification.channels.email) {
      this.logger.error?.(
        `Notification (${notification.name}) - (${notification.title}) no email channel provided`,
        LogContext.NOTIFICATIONS
      );
      return { status: 'error' };
    }

    const mailFrom = this.configService.get(
      ConfigurationTypes.NOTIFICATION_PROVIDERS
    )?.email?.from;
    const mailFromName = this.configService.get(
      ConfigurationTypes.NOTIFICATION_PROVIDERS
    )?.email?.from_name;

    if (!mailFrom) {
      this.logger.error?.(
        'Email from address not configured',
        LogContext.NOTIFICATIONS
      );
      return { status: 'error' };
    }

    const mailFromNameConfigured = mailFromName
      ? `${mailFromName} <${mailFrom}>`
      : mailFrom;
    this.logger.verbose?.(
      `Notification mail from ${mailFromNameConfigured}`,
      LogContext.NOTIFICATIONS
    );

    notification.channels.email.from = mailFromNameConfigured;

    return this.notifmeService.send(notification.channels).then(
      res => {
        this.logger.verbose?.(
          `Notification status: ${res.status}`,
          LogContext.NOTIFICATIONS
        );
        return res;
      },
      reason => {
        this.logger.warn?.(
          `Notification rejected with reason: ${reason}`,
          LogContext.NOTIFICATIONS
        );
        return { status: 'error' };
      }
    );
  }
}
