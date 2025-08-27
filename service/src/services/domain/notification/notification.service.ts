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
  SpaceLeadCommunicationMessageDirectNotificationBuilder,
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
import { VirtualContributorSpaceCommunityInvitationReceivedNotificationBuilder } from '../builders/virtual-contributor/virtual.contributor.space.community.invitation.received.notification.builder';
import { PlatformAdminSpaceCreatedNotificationBuilder } from '../builders/platform/platform.admin.space.created.notification.builder';
import { ConfigService } from '@nestjs/config';
import { NotificationTemplateBuilder } from '@src/services/external/notifme/notification.templates.builder';
import { INotificationBuilder } from '../builders/notification.builder.interface';
import { PlatformAdminUserProfileCreatedNotificationBuilder } from '../builders/platform/platform.admin.user.profile.created.notification.builder';
import { SpaceCommunicationMessageDirectSenderNotificationBuilder } from '../builders/space/space.communication.message.direct.sender.notification.builder';
import { EmailTemplate } from '@src/common/enums/email.template';
import { SpaceAdminCollaborationCalloutContributionNotificationBuilder } from '../builders/space/space.admin.collaboration.callout.contribution.notification.builder';
import { User } from '@src/core/models';
import { BaseEmailPayload } from '@src/common/email-template-payload/base.email.payload';
import { NotificationEvent } from '@src/generated/alkemio-schema';
import { NotificationEmailPayloadBuilderService } from './notification.email.payload.builder.service';
import { EventPayloadNotProvidedException } from '@src/common/exceptions/event.payload.not.provided.exception';
@Injectable()
export class NotificationService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(NOTIFICATIONS_PROVIDER)
    private readonly notifmeService: NotifmeSdk,
    private readonly configService: ConfigService,
    private spaceCommunityPlatformInvitationCreatedNotificationBuilder: SpaceCommunityInvitationPlatformCreatedNotificationBuilder,
    private spaceCommunicationUpdateNotificationBuilder: SpaceCommunicationUpdateNotificationBuilder,
    private spaceCommunicationMessageDirectSenderNotificationBuilder: SpaceCommunicationMessageDirectSenderNotificationBuilder,
    private spaceAdminCollaborationCalloutContributionNotificationBuilder: SpaceAdminCollaborationCalloutContributionNotificationBuilder,
    private spaceLeadCommunicationMessageDirectNotificationBuilder: SpaceLeadCommunicationMessageDirectNotificationBuilder,
    private spaceAdminCommunityApplicationReceivedNotificationBuilder: SpaceAdminCommunityApplicationReceivedNotificationBuilder,
    private spaceAdminCommunityNewMemberNotificationBuilder: SpaceAdminCommunityNewMemberNotificationBuilder,
    private spaceCollaborationCalloutCommentNotificationBuilder: SpaceCollaborationCalloutCommentNotificationBuilder,
    private spaceCollaborationCalloutContributionNotificationBuilder: SpaceCollaborationCalloutContributionNotificationBuilder,
    private spaceCollaborationCalloutPostContributionCommentNotificationBuilder: SpaceCollaborationCalloutPostContributionCommentNotificationBuilder,
    private spaceCollaborationCalloutPublishedNotificationBuilder: SpaceCollaborationCalloutPublishedNotificationBuilder,
    private platformForumDiscussionCreatedNotificationBuilder: PlatformForumDiscussionCreatedNotificationBuilder,
    private platformForumDiscussionCommentNotificationBuilder: PlatformForumDiscussionCommentNotificationBuilder,
    private platformAdminGlobalRoleChangeNotificationBuilder: PlatformAdminGlobalRoleChangeNotificationBuilder,
    private platformAdminUserProfileCreatedNotificationBuilder: PlatformAdminUserProfileCreatedNotificationBuilder,
    private platformAdminUserProfileRemovedNotificationBuilder: PlatformAdminUserProfileRemovedNotificationBuilder,
    private platformAdminSpaceCreatedNotificationBuilder: PlatformAdminSpaceCreatedNotificationBuilder,
    private organizationMessageRecipientNotificationBuilder: OrganizationMessageRecipientNotificationBuilder,
    private organizationMessageSenderNotificationBuilder: OrganizationMessageSenderNotificationBuilder,
    private organizationMentionNotificationBuilder: OrganizationMentionNotificationBuilder,
    private userSignUpWelcomeNotificationBuilder: UserSignUpWelcomeNotificationBuilder,
    private userCommentReplyNotificationBuilder: UserCommentReplyNotificationBuilder,
    private userMentionNotificationBuilder: UserMentionNotificationBuilder,
    private userSpaceCommunityJoinedNotificationBuilder: UserSpaceCommunityJoinedNotificationBuilder,
    private userSpaceCommunityApplicationSubmittedNotificationBuilder: UserSpaceCommunityApplicationSubmittedNotificationBuilder,
    private userSpaceCommunityInvitationReceivedNotificationBuilder: UserSpaceCommunityInvitationReceivedNotificationBuilder,
    private userMessageRecipientNotificationBuilder: UserMessageRecipientNotificationBuilder,
    private userMessageSenderNotificationBuilder: UserMessageSenderNotificationBuilder,
    private virtualContributorSpaceCommunityInvitationReceivedCreatedNotificationBuilder: VirtualContributorSpaceCommunityInvitationReceivedNotificationBuilder,

    private notificationTemplateBuilder: NotificationTemplateBuilder,
    private notificationEmailPayloadBuilderService: NotificationEmailPayloadBuilderService
  ) {}

  public async processNotificationEvent(
    payload: BaseEventPayload,
    emailTemplate: EmailTemplate
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    const emailResults = await this.buildAndSendEmailNotifications(
      payload,
      emailTemplate
    );

    return [...emailResults];
  }

  public createEmailPayloadForEvent(
    eventPayload: BaseEventPayload,
    recipient: User
  ): BaseEmailPayload {
    // Each eventPayload has the event type
    switch (eventPayload.eventType) {
      case NotificationEvent.UserSpaceCommunityApplication:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadSpaceCommunityApplication(
          eventPayload as NotificationEventPayloadSpaceCommunityApplication,
          recipient
        );
      case NotificationEvent.SpaceAdminCommunityApplication:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadSpaceAdminCommunityApplication(
          eventPayload as NotificationEventPayloadSpaceCommunityApplication,
          recipient
        );
      case NotificationEvent.UserSpaceCommunityInvitation:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadUserSpaceCommunityInvitation(
          eventPayload as NotificationEventPayloadSpaceCommunityInvitation,
          recipient
        );
      case NotificationEvent.VirtualContributorAdminSpaceCommunityInvitation:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadVirtualContributorInvitation(
          eventPayload as NotificationEventPayloadSpaceCommunityInvitationVirtualContributor,
          recipient
        );
      case NotificationEvent.SpaceCommunityInvitationUserPlatform:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadSpaceCommunityInvitationPlatform(
          eventPayload as NotificationEventPayloadSpaceCommunityInvitationPlatform,
          recipient
        );
      case NotificationEvent.UserSpaceCommunityJoined:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadUserSpaceCommunityJoined(
          eventPayload as NotificationEventPayloadSpaceCommunityContributor,
          recipient
        );
      case NotificationEvent.SpaceAdminCommunityNewMember:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadSpaceAdminCommunityNewMember(
          eventPayload as NotificationEventPayloadSpaceCommunityContributor,
          recipient
        );
      case NotificationEvent.PlatformAdminGlobalRoleChanged:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadPlatformGlobalRoleChange(
          eventPayload as NotificationEventPayloadPlatformGlobalRole,
          recipient
        );
      case NotificationEvent.UserSignUpWelcome:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadUserSignUpWelcome(
          eventPayload as NotificationEventPayloadPlatformUserRegistration,
          recipient
        );
      case NotificationEvent.PlatformAdminUserProfileCreated:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadPlatformAdminUserProfileCreated(
          eventPayload as NotificationEventPayloadPlatformUserRegistration,
          recipient
        );
      case NotificationEvent.PlatformAdminUserProfileRemoved:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadPlatformUserRemoved(
          eventPayload as NotificationEventPayloadPlatformUserRemoved,
          recipient
        );
      case NotificationEvent.PlatformForumDiscussionComment:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadPlatformForumDiscussionComment(
          eventPayload as NotificationEventPayloadPlatformForumDiscussion,
          recipient
        );
      case NotificationEvent.PlatformForumDiscussionCreated:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadPlatformForumDiscussionCreated(
          eventPayload as NotificationEventPayloadPlatformForumDiscussion,
          recipient
        );
      case NotificationEvent.SpaceCommunicationUpdate:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadSpaceCommunicationUpdate(
          eventPayload as NotificationEventPayloadSpaceCommunicationUpdate,
          recipient
        );
      case NotificationEvent.UserMessage:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadUserMessage(
          eventPayload as NotificationEventPayloadUserMessageDirect,
          recipient
        );
      case NotificationEvent.UserMessageSender:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadUserMessageSender(
          eventPayload as NotificationEventPayloadUserMessageDirect,
          recipient
        );
      case NotificationEvent.OrganizationAdminMessage:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadOrganizationMessage(
          eventPayload as NotificationEventPayloadOrganizationMessageDirect,
          recipient
        );
      case NotificationEvent.OrganizationMessageSender:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadOrganizationMessageSender(
          eventPayload as NotificationEventPayloadOrganizationMessageDirect,
          recipient
        );
      case NotificationEvent.OrganizationAdminMentioned:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadOrganizationMention(
          eventPayload as NotificationEventPayloadOrganizationMessageRoom,
          recipient
        );
      case NotificationEvent.SpaceLeadCommunicationMessage:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadSpaceCommunicationMessage(
          eventPayload as NotificationEventPayloadSpaceCommunicationMessageDirect,
          recipient
        );
      case NotificationEvent.SpaceCommunicationMessageSender:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadSpaceCommunicationMessageSender(
          eventPayload as NotificationEventPayloadSpaceCommunicationMessageDirect,
          recipient
        );
      case NotificationEvent.SpaceCollaborationCalloutContribution:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadSpaceCollaborationCalloutContribution(
          eventPayload as NotificationEventPayloadSpaceCollaborationCallout,
          recipient
        );
      case NotificationEvent.SpaceAdminCollaborationCalloutContribution:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadSpaceAdminCollaborationCalloutContribution(
          eventPayload as NotificationEventPayloadSpaceCollaborationCallout,
          recipient
        );
      case NotificationEvent.SpaceCollaborationCalloutComment:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadSpaceCollaborationCalloutComment(
          eventPayload as NotificationEventPayloadSpaceCollaborationCallout,
          recipient
        );
      case NotificationEvent.SpaceCollaborationCalloutPostContributionComment:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadSpaceCollaborationCalloutPostContributionComment(
          eventPayload as NotificationEventPayloadSpaceCollaborationCallout,
          recipient
        );
      case NotificationEvent.SpaceCollaborationCalloutPublished:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadSpaceCollaborationCalloutPublished(
          eventPayload as NotificationEventPayloadSpaceCollaborationCallout,
          recipient
        );
      case NotificationEvent.UserCommentReply:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadUserCommentReply(
          eventPayload as NotificationEventPayloadUserMessageRoomReply,
          recipient
        );
      case NotificationEvent.UserMentioned:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadUserMention(
          eventPayload as NotificationEventPayloadUserMessageRoom,
          recipient
        );
      case NotificationEvent.PlatformAdminSpaceCreated:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadPlatformAdminSpaceCreated(
          eventPayload as NotificationEventPayloadPlatformSpaceCreated,
          recipient
        );
      default:
        throw new EventPayloadNotProvidedException(
          'Event payload not provided',
          LogContext.NOTIFICATION_BUILDER
        );
    }
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
      this.spaceAdminCommunityApplicationReceivedNotificationBuilder,
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
      this
        .virtualContributorSpaceCommunityInvitationReceivedCreatedNotificationBuilder,
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
      this.userSpaceCommunityJoinedNotificationBuilder,
      EmailTemplate.USER_SPACE_COMMUNITY_JOINED
    );
  }

  async sendCommunityNewMemberAdminNotifications(
    payload: NotificationEventPayloadSpaceCommunityContributor
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceAdminCommunityNewMemberNotificationBuilder,
      EmailTemplate.SPACE_ADMIN_COMMUNITY_NEW_MEMBER
    );
  }

  async sendPlatformGlobalRoleChangeNotification(
    payload: NotificationEventPayloadPlatformGlobalRole
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.platformAdminGlobalRoleChangeNotificationBuilder,
      EmailTemplate.PLATFORM_ADMIN_USER_GLOBAL_ROLE_CHANGE
    );
  }

  async sendUserSignUpWelcomeNotification(
    payload: NotificationEventPayloadPlatformUserRegistration
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.userSignUpWelcomeNotificationBuilder,
      EmailTemplate.USER_SIGN_UP_WELCOME
    );
  }

  async sendPlatformAdminUserProfileCreatedNotification(
    payload: NotificationEventPayloadPlatformUserRegistration
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.platformAdminUserProfileCreatedNotificationBuilder,
      EmailTemplate.PLATFORM_ADMIN_USER_PROFILE_CREATED
    );
  }

  async sendPlatformUserRemovedNotification(
    payload: NotificationEventPayloadPlatformUserRemoved
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.platformAdminUserProfileRemovedNotificationBuilder,
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

  async sendOrganizationMessageSenderNotification(
    payload: NotificationEventPayloadOrganizationMessageDirect
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.organizationMessageSenderNotificationBuilder,
      EmailTemplate.ORGANIZATION_MESSAGE_SENDER
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
      this.spaceLeadCommunicationMessageDirectNotificationBuilder,
      EmailTemplate.SPACE_LEAD_COMMUNICATION_MESSAGE_DIRECT
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

  async sendSpaceCollaborationCalloutContributionNotification(
    payload: NotificationEventPayloadSpaceCollaborationCallout
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCollaborationCalloutContributionNotificationBuilder,
      EmailTemplate.SPACE_COLLABORATION_CALLOUT_CONTRIBUTION
    );
  }

  async sendSpaceAdminCollaborationCalloutContributionNotification(
    payload: NotificationEventPayloadSpaceCollaborationCallout
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceAdminCollaborationCalloutContributionNotificationBuilder,
      EmailTemplate.SPACE_ADMIN_COLLABORATION_CALLOUT_CONTRIBUTION
    );
  }

  async sendSpaceCollaborationCalloutCommentNotification(
    payload: NotificationEventPayloadSpaceCollaborationCallout
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCollaborationCalloutCommentNotificationBuilder,
      EmailTemplate.SPACE_COLLABORATION_CALLOUT_COMMENT
    );
  }

  async sendSpaceCollaborationCalloutPostContributionCommentNotification(
    payload: NotificationEventPayloadSpaceCollaborationCallout
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCollaborationCalloutPostContributionCommentNotificationBuilder,
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
      this.platformAdminSpaceCreatedNotificationBuilder,
      EmailTemplate.PLATFORM_ADMIN_SPACE_CREATED
    );
  }

  private async buildAndSendEmailNotifications(
    payload: BaseEventPayload,
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
      const templatePayload2 = this.createEmailPayloadForEvent(
        payload,
        recipient
      );
      const emailNotificationTemplate =
        this.notificationTemplateBuilder.buildTemplate(
          emailTemplate,
          templatePayload2
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
