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
  SpaceCollaborationCalloutPublishedEventPayload,
  SpaceCollaborationPostCommentEventPayload,
  SpaceCollaborationPostCreatedEventPayload,
  SpaceCollaborationWhiteboardCreatedEventPayload,
  UserCommentReplyEventPayload,
  SpaceCommunicationLeadsMessageEventPayload,
  OrganizationMentionEventPayload,
  OrganizationMessageEventPayload,
  SpaceCommunicationUpdateEventPayload,
  UserMentionEventPayload,
  UserMessageEventPayload,
  SpaceCommunityApplicationCreatedEventPayload,
  SpaceCommunityInvitationCreatedEventPayload,
  SpaceCommunityInvitationVirtualContributorCreatedEventPayload,
  SpaceCommunityNewMemberPayload,
  SpaceCommunityPlatformInvitationCreatedEventPayload,
  PlatformForumDiscussionCommentEventPayload,
  PlatformForumDiscussionCreatedEventPayload,
  PlatformGlobalRoleChangeEventPayload,
  PlatformUserRegistrationEventPayload,
  PlatformUserRemovedEventPayload,
  PlatformSpaceCreatedEventPayload,
} from '@alkemio/notifications-lib';
import { NotificationTemplateType } from '@src/types/notification.template.type';
import {
  SpaceCollaborationCalloutPublishedNotificationBuilder,
  SpaceCollaborationPostCommentNotificationBuilder,
  SpaceCollaborationPostCreatedMemberNotificationBuilder,
  SpaceCommunicationLeadsMessageRecipientNotificationBuilder,
  OrganizationMentionNotificationBuilder,
  OrganizationMessageSenderNotificationBuilder,
  OrganizationMessageRecipientNotificationBuilder,
  SpaceCommunicationUpdateMemberNotificationBuilder,
  SpaceCommunicationUpdateAdminNotificationBuilder,
  UserMentionNotificationBuilder,
  UserMessageRecipientNotificationBuilder,
  UserMessageSenderNotificationBuilder,
  SpaceCommunityApplicationCreatedAdminNotificationBuilder,
  SpaceCommunityInvitationCreatedInviteeNotificationBuilder,
  SpaceCommunityNewMemberNotificationBuilder,
  SpaceCommunityInvitationPlatformCreatedNotificationBuilder,
  PlatformForumDiscussionCommentNotificationBuilder,
  PlatformForumDiscussionCreatedNotificationBuilder,
  PlatformUserRegisteredNotificationBuilder,
} from '../builders';
import { NotificationNoChannelsException } from '@src/common/exceptions';
import { PlatformUserRemovedNotificationBuilder } from '../builders/platform/platform.user.removed.notification.builder';
import { SpaceCollaborationWhiteboardCreatedNotificationBuilder } from '../builders/space/space.collaboration.whiteboard.created.notification.builder';
import { UserCommentReplyNotificationBuilder } from '../builders/user/user.comment.reply.notification.builder';
import { PlatformGlobalRoleChangeNotificationBuilder } from '../builders/platform/platform.global.role.change.notification.builder';
import { SpaceCommunityInvitationVirtualContributorCreatedNotificationBuilder } from '../builders/space/space.community.invitation.virtual.contributor.created.notification.builder';
import { PlatformSpaceCreatedNotificationBuilder } from '../builders/platform/platform.space.created.notification.builder';
import { ConfigService } from '@nestjs/config';
import { NotificationTemplateBuilder } from '@src/services/external/notifme/notification.templates.builder';
import { INotificationBuilder } from '../builders/notification.builder.interface';
@Injectable()
export class NotificationService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(NOTIFICATIONS_PROVIDER)
    private readonly notifmeService: NotifmeSdk,
    private readonly configService: ConfigService,
    private communityApplicationCreatedNotificationBuilder: SpaceCommunityApplicationCreatedAdminNotificationBuilder,
    private communityInvitationCreatedNotificationBuilder: SpaceCommunityInvitationCreatedInviteeNotificationBuilder,
    private communityPlatformInvitationCreatedNotificationBuilder: SpaceCommunityInvitationPlatformCreatedNotificationBuilder,
    private spaceCommunicationUpdateNotificationBuilder: SpaceCommunicationUpdateMemberNotificationBuilder,
    private spaceCommunicationUpdateAdminNotificationBuilder: SpaceCommunicationUpdateAdminNotificationBuilder,
    private communicationDiscussionCreatedNotificationBuilder: PlatformForumDiscussionCreatedNotificationBuilder,
    private communicationCommunityLeadsMessageNotificationBuilder: SpaceCommunicationLeadsMessageRecipientNotificationBuilder,
    private communicationUserMentionNotificationBuilder: UserMentionNotificationBuilder,
    private communityNewMemberNotificationBuilder: SpaceCommunityNewMemberNotificationBuilder,
    private collaborationWhiteboardCreatedNotificationBuilder: SpaceCollaborationWhiteboardCreatedNotificationBuilder,
    private collaborationPostCreatedNotificationBuilder: SpaceCollaborationPostCreatedMemberNotificationBuilder,
    private collaborationPostCommentNotificationBuilder: SpaceCollaborationPostCommentNotificationBuilder,
    private collaborationCalloutPublishedNotificationBuilder: SpaceCollaborationCalloutPublishedNotificationBuilder,
    private commentReplyNotificationBuilder: UserCommentReplyNotificationBuilder,
    private communityInvitationVirtualContributorCreatedNotificationBuilder: SpaceCommunityInvitationVirtualContributorCreatedNotificationBuilder,
    private platformGlobalRoleChangeNotificationBuilder: PlatformGlobalRoleChangeNotificationBuilder,
    private platformUserRegisteredNotificationBuilder: PlatformUserRegisteredNotificationBuilder,
    private platformUserRemovedNotificationBuilder: PlatformUserRemovedNotificationBuilder,
    private platformForumDiscussionCommentNotificationBuilder: PlatformForumDiscussionCommentNotificationBuilder,
    private platformSpaceCreatedNotificationBuilder: PlatformSpaceCreatedNotificationBuilder,
    private organizationMessageRecipientNotificationBuilder: OrganizationMessageRecipientNotificationBuilder,
    private organizationMessageSenderNotificationBuilder: OrganizationMessageSenderNotificationBuilder,
    private organizationMentionNotificationBuilder: OrganizationMentionNotificationBuilder,
    private userMessageRecipientNotificationBuilder: UserMessageRecipientNotificationBuilder,
    private userMessageSenderNotificationBuilder: UserMessageSenderNotificationBuilder,
    private notificationTemplateBuilder: NotificationTemplateBuilder
  ) {}

  private async processNotificationEvent(
    payload: BaseEventPayload,
    builder: INotificationBuilder
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    const emailResults = await this.buildAndSendEmailNotifications(
      payload,
      builder
    );

    return [...emailResults];
  }

  async sendApplicationCreatedNotifications(
    payload: SpaceCommunityApplicationCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.communityApplicationCreatedNotificationBuilder
    );
  }

  async sendInvitationCreatedNotifications(
    payload: SpaceCommunityInvitationCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.communityInvitationCreatedNotificationBuilder
    );
  }

  async sendVirtualContributorInvitationCreatedNotifications(
    payload: SpaceCommunityInvitationVirtualContributorCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.communityInvitationVirtualContributorCreatedNotificationBuilder
    );
  }

  async sendCommunityPlatformInvitationCreatedNotifications(
    payload: SpaceCommunityPlatformInvitationCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.communityPlatformInvitationCreatedNotificationBuilder
    );
  }

  async sendCommunityNewMemberNotifications(
    payload: SpaceCommunityNewMemberPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.communityNewMemberNotificationBuilder
    );
  }

  async sendPlatformGlobalRoleChangeNotification(
    payload: PlatformGlobalRoleChangeEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.platformGlobalRoleChangeNotificationBuilder
    );
  }

  async sendPlatformUserRegisteredNotification(
    payload: PlatformUserRegistrationEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.platformUserRegisteredNotificationBuilder
    );
  }

  async sendPlatformUserRemovedNotification(
    payload: PlatformUserRemovedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.platformUserRemovedNotificationBuilder
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

  async sendPlatformForumDiscussionCreatedNotification(
    payload: PlatformForumDiscussionCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.communicationDiscussionCreatedNotificationBuilder
    );
  }

  async sendSpaceCommunicationUpdateNotification(
    payload: SpaceCommunicationUpdateEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCommunicationUpdateNotificationBuilder
    );
  }

  async sendSpaceCommunicationUpdateAdminNotification(
    payload: SpaceCommunicationUpdateEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCommunicationUpdateAdminNotificationBuilder
    );
  }

  async sendUserMessageRecipientNotification(
    payload: UserMessageEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.userMessageRecipientNotificationBuilder
    );
  }

  async sendUserMessageSenderNotification(
    payload: UserMessageEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.userMessageSenderNotificationBuilder
    );
  }

  async sendOrganizationMessageRecipientNotification(
    payload: OrganizationMessageEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.organizationMessageRecipientNotificationBuilder
    );
  }

  async sendOrganizationMentionNotification(
    payload: OrganizationMentionEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.organizationMentionNotificationBuilder
    );
  }

  async sendCommunicationCommunityLeadsMessageNotification(
    payload: SpaceCommunicationLeadsMessageEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.communicationCommunityLeadsMessageNotificationBuilder
    );
  }

  async sendCommunicationUserMentionNotification(
    payload: UserMentionEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.communicationUserMentionNotificationBuilder
    );
  }

  async sendPostCreatedNotification(
    payload: SpaceCollaborationPostCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.collaborationPostCreatedNotificationBuilder
    );
  }

  async sendWhiteboardCreatedNotification(
    payload: SpaceCollaborationWhiteboardCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.collaborationWhiteboardCreatedNotificationBuilder
    );
  }

  async sendPostCommentCreatedNotification(
    payload: SpaceCollaborationPostCommentEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.collaborationPostCommentNotificationBuilder
    );
  }

  async sendCalloutPublishedNotification(
    payload: SpaceCollaborationCalloutPublishedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.collaborationCalloutPublishedNotificationBuilder
    );
  }

  async sendCommentReplyNotification(
    payload: UserCommentReplyEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.commentReplyNotificationBuilder
    );
  }

  async sendPlatformSpaceCreatedNotification(
    payload: PlatformSpaceCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.platformSpaceCreatedNotificationBuilder
    );
  }

  private async buildAndSendEmailNotifications(
    payload: BaseEventPayload,
    builder: INotificationBuilder
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    const notificationTemplatesToSend: Promise<
      NotificationTemplateType | undefined
    >[] = [];

    for (const recipient of payload.recipients) {
      const templatePayload = builder.createEmailTemplatePayload(
        payload,
        recipient
      );
      const emailNotificationTemplate =
        this.notificationTemplateBuilder.buildTemplate(
          builder.emailTemplate,
          templatePayload
        );

      notificationTemplatesToSend.push(emailNotificationTemplate);
    }

    this.logger.verbose?.(
      ' ...building notifications - completed',
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
