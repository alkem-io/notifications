import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import NotifmeSdk, { NotificationStatus } from 'notifme-sdk';
import {
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
  NotificationEventType,
  PlatformForumDiscussionCommentEventPayload,
  PlatformForumDiscussionCreatedEventPayload,
  PlatformGlobalRoleChangeEventPayload,
  PlatformUserRegistrationEventPayload,
  PlatformUserRemovedEventPayload,
  SpaceCreatedEventPayload,
} from '@alkemio/notifications-lib';
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
import { NotificationTemplateBuilder } from '@src/services/external/notifme/notification.templates.builder';
import { EventEmailRecipients } from '@src/core/models/EventEmailRecipients';
@Injectable()
export class NotificationService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
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
    private communityInvitationVirtualContributorCreatedNotificationBuilder: CommunityInvitationVirtualContributorCreatedNotificationBuilder,
    private spaceCreatedNotificationBuilder: SpaceCreatedNotificationBuilder,
    private notificationTemplateBuilder: NotificationTemplateBuilder
  ) {}

  private async processNotificationEvent(
    payload: BaseEventPayload,
    builder: INotificationBuilder
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    const emailRecipientsSets = await builder.getEmailRecipientSets(payload);
    return this.buildAndSend(emailRecipientsSets, payload, builder);
  }

  async sendApplicationCreatedNotifications(
    payload: CommunityApplicationCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.communityApplicationCreatedNotificationBuilder
    );
  }

  async sendInvitationCreatedNotifications(
    payload: CommunityInvitationCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.communityInvitationCreatedNotificationBuilder
    );
  }

  async sendVirtualContributorInvitationCreatedNotifications(
    payload: CommunityInvitationVirtualContributorCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.communityInvitationVirtualContributorCreatedNotificationBuilder
    );
  }

  async sendCommunityPlatformInvitationCreatedNotifications(
    payload: CommunityPlatformInvitationCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.communityPlatformInvitationCreatedNotificationBuilder
    );
  }

  async sendCommunityNewMemberNotifications(
    payload: CommunityNewMemberPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.communityNewMemberNotificationBuilder
    );
  }

  async sendGlobalRoleChangeNotification(
    payload: PlatformGlobalRoleChangeEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.platformGlobalRoleChangeNotificationBuilder
    );
  }

  async sendUserRegisteredNotification(
    payload: PlatformUserRegistrationEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.platformUserRegisteredNotificationBuilder
    );
  }

  async sendUserRemovedNotification(
    payload: PlatformUserRemovedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.platformUserRemovedNotificationBuilder
    );
  }

  async sendCommunicationUpdatedNotification(
    payload: CommunicationUpdateEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.communicationUpdatedNotificationBuilder
    );
  }

  async sendPlatformForumDiscussionCreatedNotification(
    payload: PlatformForumDiscussionCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.communicationDiscussionCreatedNotificationBuilder
    );
  }

  async sendPlatformForumDiscussionCommentNotification(
    payload: PlatformForumDiscussionCommentEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.platformForumDiscussionCommentNotificationBuilder
    );
  }

  async sendCommunicationUserMessageNotification(
    payload: CommunicationUserMessageEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.communicationUserMessageNotificationBuilder
    );
  }

  async sendCommunicationOrganizationMessageNotification(
    payload: CommunicationOrganizationMessageEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.communicationOrganizationMessageNotificationBuilder
    );
  }

  async sendCommunicationCommunityLeadsMessageNotification(
    payload: CommunicationCommunityLeadsMessageEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.communicationCommunityLeadsMessageNotificationBuilder
    );
  }

  async sendCommunicationUserMentionNotification(
    payload: CommunicationUserMentionEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.communicationUserMentionNotificationBuilder
    );
  }

  async sendCommunicationOrganizationMentionNotification(
    payload: CommunicationOrganizationMentionEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.communicationOrganizationMentionNotificationBuilder
    );
  }

  async sendPostCreatedNotification(
    payload: CollaborationPostCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.collaborationPostCreatedNotificationBuilder
    );
  }

  async sendWhiteboardCreatedNotification(
    payload: CollaborationWhiteboardCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.collaborationWhiteboardCreatedNotificationBuilder
    );
  }

  async sendPostCommentCreatedNotification(
    payload: CollaborationPostCommentEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.collaborationPostCommentNotificationBuilder
    );
  }

  async sendDiscussionCommentCreatedNotification(
    payload: CollaborationDiscussionCommentEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.collaborationDiscussionCommentNotificationBuilder
    );
  }

  async sendCalloutPublishedNotification(
    payload: CollaborationCalloutPublishedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.collaborationCalloutPublishedNotificationBuilder
    );
  }

  async sendCommentReplyNotification(
    payload: CommentReplyEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.commentReplyNotificationBuilder
    );
  }

  async buildAndSendSpaceCreatedNotification(
    payload: SpaceCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCreatedNotificationBuilder
    );
  }

  private async buildAndSend(
    emailRecipientsSets: EventEmailRecipients[],
    payload: BaseEventPayload,
    builder: INotificationBuilder
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    const notificationTemplatesToSend: Promise<
      NotificationTemplateType | undefined
    >[] = [];
    for (const recipientSet of emailRecipientsSets) {
      for (const recipient of recipientSet.emailRecipients) {
        const templatePayload = builder.createEmailTemplatePayload(
          payload,
          recipient
        );
        const emailNotificationTemplate =
          this.notificationTemplateBuilder.buildTemplate(
            recipientSet.emailTemplate,
            templatePayload
          );

        notificationTemplatesToSend.push(emailNotificationTemplate);
      }
    }
    this.logger.verbose?.(
      `[${NotificationEventType.COMMUNITY_APPLICATION_CREATED}] ...building notifications - completed`,
      LogContext.NOTIFICATIONS
    );

    // filter all rejected notifications and log them
    const notificationResults = await Promise.allSettled(
      notificationTemplatesToSend
    );
    const notificationTemplateTypes: NotificationTemplateType[] = [];
    notificationResults.forEach(notification => {
      if (this.isPromiseFulfilledResult(notification)) {
        const value = notification.value;
        if (value) notificationTemplateTypes.push(value);
      } else {
        this.logger.warn(
          `Filtering rejected notification content: ${notification.reason}`,
          LogContext.NOTIFICATIONS
        );
      }
    });
    try {
      return Promise.allSettled(
        notificationTemplateTypes.map(x => this.sendNotification(x))
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

  private isPromiseFulfilledResult = (
    result: PromiseSettledResult<any>
  ): result is PromiseFulfilledResult<any> => result.status === 'fulfilled';
}
