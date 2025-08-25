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
  NotificationEventPayloadSpaceCollaborationCallout,
  NotificationEventPayloadSpaceCommunicationMessageDirect,
  NotificationEventPayloadOrganizationMessageRoom,
  NotificationEventPayloadOrganizationMessageDirect,
  NotificationEventPayloadSpaceCommunicationUpdate,
  NotificationEventPayloadUserMessageDirect,
  NotificationEventPayloadSpaceCommunityInvitation,
  NotificationEventPayloadPlatformForumDiscussion,
  NotificationEventPayloadPlatformGlobalRole,
  NotificationEventPayloadPlatformUserRegistration,
  NotificationEventPayloadPlatformUserRemoved,
  NotificationEventPayloadPlatformSpaceCreated,
  NotificationEventPayloadSpaceCommunityApplication,
  NotificationEventPayloadSpaceCommunityInvitationVirtualContributor,
  NotificationEventPayloadSpaceCommunityInvitationPlatform,
  NotificationEventPayloadSpaceCommunityContributor,
  NotificationEventPayloadUserMessageRoomReply,
  NotificationEventPayloadUserMessageRoom,
} from '@alkemio/notifications-lib';
import { NotificationTemplateType } from '@src/types/notification.template.type';
import {
  SpaceCollaborationCalloutPublishedNotificationBuilder,
  SpaceCollaborationCalloutPostContributionCommentNotificationBuilder,
  SpaceCollaborationCalloutContributionNotificationBuilder,
  SpaceAdminCommunicationMessageDirectNotificationBuilder,
  OrganizationMentionNotificationBuilder,
  OrganizationMessageSenderNotificationBuilder,
  OrganizationMessageRecipientNotificationBuilder,
  SpaceCommunicationUpdateNotificationBuilder,
  UserMentionNotificationBuilder,
  UserMessageRecipientNotificationBuilder,
  UserMessageSenderNotificationBuilder,
  SpaceAdminCommunityApplicationReceivedNotificationBuilder,
  UserSpaceCommunityInvitationReceivedNotificationBuilder,
  UserSpaceCommunityJoinedNotificationBuilder,
  SpaceCommunityInvitationPlatformCreatedNotificationBuilder,
  PlatformForumDiscussionCommentNotificationBuilder,
  PlatformForumDiscussionCreatedNotificationBuilder,
  UserSignUpWelcomeNotificationBuilder,
  UserSpaceCommunityApplicationSubmittedNotificationBuilder,
  SpaceAdminCommunityNewMemberNotificationBuilder,
} from '../builders';
import { NotificationNoChannelsException } from '@src/common/exceptions';
import { PlatformAdminUserProfileRemovedNotificationBuilder } from '../builders/platform/platform.admin.user.profile.removed.notification.builder';
import { SpaceCollaborationCalloutCommentNotificationBuilder } from '../builders/space/space.collaboration.callout.comment.notification.builder';
import { UserCommentReplyNotificationBuilder } from '../builders/user/user.comment.reply.notification.builder';
import { PlatformAdminGlobalRoleChangeNotificationBuilder } from '../builders/platform/platform.admin.global.role.change.notification.builder';
import { SpaceCommunityInvitationVirtualContributorCreatedNotificationBuilder } from '../builders/virtual-contributor/virtual.contributor.space.community.invitation.received.notification.builder';
import { PlatformAdminSpaceCreatedNotificationBuilder } from '../builders/platform/platform.admin.space.created.notification.builder';
import { ConfigService } from '@nestjs/config';
import { NotificationTemplateBuilder } from '@src/services/external/notifme/notification.templates.builder';
import { INotificationBuilder } from '../builders/notification.builder.interface';
import { PlatformAdminUserProfileCreatedNotificationBuilder } from '../builders/platform/platform.admin.user.profile.created.notification.builder';
import { SpaceCommunicationMessageDirectSenderNotificationBuilder } from '../builders/space/space.communication.message.direct.sender.notification.builder';
import { EmailTemplate } from '@src/common/enums/email.template';
@Injectable()
export class NotificationService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(NOTIFICATIONS_PROVIDER)
    private readonly notifmeService: NotifmeSdk,
    private readonly configService: ConfigService,
    private spaceCommunityApplicationAdminNotificationBuilder: SpaceAdminCommunityApplicationReceivedNotificationBuilder,
    private spaceCommunityPlatformInvitationCreatedNotificationBuilder: SpaceCommunityInvitationPlatformCreatedNotificationBuilder,
    private spaceCommunicationUpdateNotificationBuilder: SpaceCommunicationUpdateNotificationBuilder,
    private spaceCommunicationMessageDirectRecipientNotificationBuilder: SpaceAdminCommunicationMessageDirectNotificationBuilder,
    private spaceCommunicationMessageDirectSenderNotificationBuilder: SpaceCommunicationMessageDirectSenderNotificationBuilder,
    private userMentionNotificationBuilder: UserMentionNotificationBuilder,
    private spaceCommunityNewMemberNotificationBuilder: UserSpaceCommunityJoinedNotificationBuilder,
    private spaceCommunityNewMemberAdminNotificationBuilder: SpaceAdminCommunityNewMemberNotificationBuilder,
    private spaceCollaborationWhiteboardCreatedNotificationBuilder: SpaceCollaborationCalloutCommentNotificationBuilder,
    private spaceCollaborationPostCreatedNotificationBuilder: SpaceCollaborationCalloutContributionNotificationBuilder,
    private spaceCollaborationPostCommentNotificationBuilder: SpaceCollaborationCalloutPostContributionCommentNotificationBuilder,
    private spaceCollaborationCalloutPublishedNotificationBuilder: SpaceCollaborationCalloutPublishedNotificationBuilder,
    private userCommentReplyNotificationBuilder: UserCommentReplyNotificationBuilder,
    private spaceCommunityInvitationVirtualContributorCreatedNotificationBuilder: SpaceCommunityInvitationVirtualContributorCreatedNotificationBuilder,
    private platformForumDiscussionCreatedNotificationBuilder: PlatformForumDiscussionCreatedNotificationBuilder,
    private platformGlobalRoleChangeNotificationBuilder: PlatformAdminGlobalRoleChangeNotificationBuilder,
    private platformUserRegisteredNotificationBuilder: UserSignUpWelcomeNotificationBuilder,
    private platformUserRegisteredAdminNotificationBuilder: PlatformAdminUserProfileCreatedNotificationBuilder,
    private platformUserRemovedNotificationBuilder: PlatformAdminUserProfileRemovedNotificationBuilder,
    private platformForumDiscussionCommentNotificationBuilder: PlatformForumDiscussionCommentNotificationBuilder,
    private platformSpaceCreatedNotificationBuilder: PlatformAdminSpaceCreatedNotificationBuilder,
    private organizationMessageRecipientNotificationBuilder: OrganizationMessageRecipientNotificationBuilder,
    private organizationMessageSenderNotificationBuilder: OrganizationMessageSenderNotificationBuilder,
    private organizationMentionNotificationBuilder: OrganizationMentionNotificationBuilder,
    private userSpaceCommunityApplicationSubmittedNotificationBuilder: UserSpaceCommunityApplicationSubmittedNotificationBuilder,
    private userSpaceCommunityInvitationReceivedNotificationBuilder: UserSpaceCommunityInvitationReceivedNotificationBuilder,
    private userMessageRecipientNotificationBuilder: UserMessageRecipientNotificationBuilder,
    private userMessageSenderNotificationBuilder: UserMessageSenderNotificationBuilder,
    private notificationTemplateBuilder: NotificationTemplateBuilder
  ) {}

  private async processNotificationEvent(
    payload: BaseEventPayload,
    builder: INotificationBuilder,
    emailTemplate: EmailTemplate
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    const emailResults = await this.buildAndSendEmailNotifications(
      payload,
      builder,
      emailTemplate
    );

    return [...emailResults];
  }

  async sendUserSpaceCommunityApplicationNotifications(
    payload: NotificationEventPayloadSpaceCommunityApplication
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.userSpaceCommunityApplicationSubmittedNotificationBuilder,
      EmailTemplate.USER_SPACE_COMMUNITY_APPLICATION_SUBMITTED
    );
  }

  async sendSpaceAdminCommunityApplicationReceivedNotifications(
    payload: NotificationEventPayloadSpaceCommunityApplication
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCommunityApplicationAdminNotificationBuilder,
      EmailTemplate.SPACE_ADMIN_COMMUNITY_USER_APPLICATION_RECEIVED
    );
  }

  async sendUserSpaceCommunityInvitationNotifications(
    payload: NotificationEventPayloadSpaceCommunityInvitation
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.userSpaceCommunityInvitationReceivedNotificationBuilder,
      EmailTemplate.USER_SPACE_COMMUNITY_INVITATION_RECEIVED
    );
  }

  async sendVirtualContributorInvitationCreatedNotifications(
    payload: NotificationEventPayloadSpaceCommunityInvitationVirtualContributor
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCommunityInvitationVirtualContributorCreatedNotificationBuilder,
      EmailTemplate.VIRTUAL_CONTRIBUTOR_INVITATION_RECEIVED
    );
  }

  async sendCommunityInvitationPlatformNotifications(
    payload: NotificationEventPayloadSpaceCommunityInvitationPlatform
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCommunityPlatformInvitationCreatedNotificationBuilder,
      EmailTemplate.USER_SPACE_COMMUNITY_INVITATION_RECEIVED
    );
  }

  async sendUserSpaceCommunityJoinedNotifications(
    payload: NotificationEventPayloadSpaceCommunityContributor
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCommunityNewMemberNotificationBuilder,
      EmailTemplate.USER_SPACE_COMMUNITY_JOINED
    );
  }

  async sendCommunityNewMemberAdminNotifications(
    payload: NotificationEventPayloadSpaceCommunityContributor
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCommunityNewMemberAdminNotificationBuilder,
      EmailTemplate.SPACE_ADMIN_COMMUNITY_NEW_MEMBER
    );
  }

  async sendPlatformGlobalRoleChangeNotification(
    payload: NotificationEventPayloadPlatformGlobalRole
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.platformGlobalRoleChangeNotificationBuilder,
      EmailTemplate.PLATFORM_ADMIN_USER_GLOBAL_ROLE_CHANGE
    );
  }

  async sendUserSignUpWelcomeNotification(
    payload: NotificationEventPayloadPlatformUserRegistration
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.platformUserRegisteredNotificationBuilder,
      EmailTemplate.USER_SIGN_UP_WELCOME
    );
  }

  async sendPlatformAdminUserProfileCreatedNotification(
    payload: NotificationEventPayloadPlatformUserRegistration
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.platformUserRegisteredAdminNotificationBuilder,
      EmailTemplate.PLATFORM_ADMIN_USER_PROFILE_CREATED
    );
  }

  async sendPlatformUserRemovedNotification(
    payload: NotificationEventPayloadPlatformUserRemoved
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.platformUserRemovedNotificationBuilder,
      EmailTemplate.PLATFORM_ADMIN_USER_PROFILE_REMOVED
    );
  }

  async sendPlatformForumDiscussionCommentNotification(
    payload: NotificationEventPayloadPlatformForumDiscussion
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.platformForumDiscussionCommentNotificationBuilder,
      EmailTemplate.PLATFORM_FORUM_DISCUSSION_COMMENT
    );
  }

  async sendPlatformForumDiscussionCreatedNotification(
    payload: NotificationEventPayloadPlatformForumDiscussion
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.platformForumDiscussionCreatedNotificationBuilder,
      EmailTemplate.PLATFORM_FORUM_DISCUSSION_CREATED
    );
  }

  async sendSpaceCommunicationUpdateNotification(
    payload: NotificationEventPayloadSpaceCommunicationUpdate
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCommunicationUpdateNotificationBuilder,
      EmailTemplate.SPACE_COMMUNICATION_UPDATE_MEMBER
    );
  }

  async sendUserMessageRecipientNotification(
    payload: NotificationEventPayloadUserMessageDirect
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.userMessageRecipientNotificationBuilder,
      EmailTemplate.USER_MESSAGE_RECIPIENT
    );
  }

  async sendUserMessageSenderNotification(
    payload: NotificationEventPayloadUserMessageDirect
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.userMessageSenderNotificationBuilder,
      EmailTemplate.USER_MESSAGE_SENDER
    );
  }

  async sendOrganizationMessageRecipientNotification(
    payload: NotificationEventPayloadOrganizationMessageDirect
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.organizationMessageRecipientNotificationBuilder,
      EmailTemplate.ORGANIZATION_MESSAGE_RECIPIENT
    );
  }

  async sendOrganizationMentionNotification(
    payload: NotificationEventPayloadOrganizationMessageRoom
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.organizationMentionNotificationBuilder,
      EmailTemplate.ORGANIZATION_MENTION
    );
  }

  async sendSpaceCommunicationMessageRecipientNotification(
    payload: NotificationEventPayloadSpaceCommunicationMessageDirect
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCommunicationMessageDirectRecipientNotificationBuilder,
      EmailTemplate.SPACE_ADMIN_COMMUNICATION_MESSAGE_DIRECT
    );
  }

  async sendSpaceCommunicationMessageSenderNotification(
    payload: NotificationEventPayloadSpaceCommunicationMessageDirect
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCommunicationMessageDirectSenderNotificationBuilder,
      EmailTemplate.SPACE_COMMUNICATION_MESSAGE_DIRECT_SENDER
    );
  }

  async sendSpaceCollaborationCalloutContributionCreatedNotification(
    payload: NotificationEventPayloadSpaceCollaborationCallout
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCollaborationPostCreatedNotificationBuilder,
      EmailTemplate.SPACE_COLLABORATION_CALLOUT_CONTRIBUTION
    );
  }

  async sendSpaceCollaborationCalloutCommentNotification(
    payload: NotificationEventPayloadSpaceCollaborationCallout
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCollaborationWhiteboardCreatedNotificationBuilder,
      EmailTemplate.SPACE_COLLABORATION_CALLOUT_COMMENT
    );
  }

  async sendSpaceCollaborationCalloutPostContributionCommentNotification(
    payload: NotificationEventPayloadSpaceCollaborationCallout
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCollaborationPostCommentNotificationBuilder,
      EmailTemplate.SPACE_COLLABORATION_CALLOUT_POST_CONTRIBUTION_COMMENT
    );
  }

  async sendSpaceCollaborationCalloutPublishedNotification(
    payload: NotificationEventPayloadSpaceCollaborationCallout
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCollaborationCalloutPublishedNotificationBuilder,
      EmailTemplate.SPACE_COLLABORATION_CALLOUT_PUBLISHED
    );
  }

  async sendUserCommentReplyNotification(
    payload: NotificationEventPayloadUserMessageRoomReply
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.userCommentReplyNotificationBuilder,
      EmailTemplate.USER_COMMENT_REPLY
    );
  }

  async sendUserMentionNotification(
    payload: NotificationEventPayloadUserMessageRoom
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.userMentionNotificationBuilder,
      EmailTemplate.USER_MENTION
    );
  }

  async sendPlatformAdminSpaceCreatedNotification(
    payload: NotificationEventPayloadPlatformSpaceCreated
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.platformSpaceCreatedNotificationBuilder,
      EmailTemplate.PLATFORM_ADMIN_SPACE_CREATED
    );
  }

  private async buildAndSendEmailNotifications(
    payload: BaseEventPayload,
    builder: INotificationBuilder,
    emailTemplate: EmailTemplate
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    const notificationTemplatesToSend: Promise<
      NotificationTemplateType | undefined
    >[] = [];

    if (!payload?.recipients || payload.recipients.length === 0) {
      this.logger.verbose?.(
        `[${payload.eventType}] - No recipients found, aborting notification sending.`,
        LogContext.NOTIFICATIONS
      );
      return [];
    }

    for (const recipient of payload.recipients) {
      const templatePayload = builder.createEmailTemplatePayload(
        payload,
        recipient
      );
      const emailNotificationTemplate =
        this.notificationTemplateBuilder.buildTemplate(
          emailTemplate,
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

    notification.channels.email.from = mailFromNameConfigured;

    try {
      const res = await this.notifmeService.send(notification.channels);
      this.logger.verbose?.(
        `[${notification.name}] Notification sent from ${mailFromNameConfigured} - status: ${res.status}`,
        LogContext.NOTIFICATIONS
      );
      return res;
    } catch (reason) {
      this.logger.warn?.(
        `Notification rejected with reason: ${reason}`,
        LogContext.NOTIFICATIONS
      );
      return { status: 'error' };
    }
  }

  private isPromiseFulfilledResult = (
    result: PromiseSettledResult<any>
  ): result is PromiseFulfilledResult<any> => result.status === 'fulfilled';
}
