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
  USERSpaceCommunityInvitationReceivedNotificationBuilder,
  SpaceCommunityNewMemberNotificationBuilder,
  SpaceCommunityInvitationPlatformCreatedNotificationBuilder,
  PlatformForumDiscussionCommentNotificationBuilder,
  PlatformForumDiscussionCreatedNotificationBuilder,
  PlatformUserRegisteredNotificationBuilder,
  SpaceCommunityApplicationApplicantNotificationBuilder,
  SpaceAdminCommunityNewMemberNotificationBuilder,
} from '../builders';
import { NotificationNoChannelsException } from '@src/common/exceptions';
import { PlatformUserRemovedNotificationBuilder } from '../builders/platform/platform.user.removed.notification.builder';
import { SpaceCollaborationCalloutCommentNotificationBuilder } from '../builders/space/space.collaboration.callout.comment.notification.builder';
import { UserCommentReplyNotificationBuilder } from '../builders/user/user.comment.reply.notification.builder';
import { PlatformGlobalRoleChangeNotificationBuilder } from '../builders/platform/platform.global.role.change.notification.builder';
import { SpaceCommunityInvitationVirtualContributorCreatedNotificationBuilder } from '../builders/virtual-contributor/virtual.contributor.space.community.invitation.received.notification.builder';
import { PlatformSpaceCreatedNotificationBuilder } from '../builders/platform/platform.space.created.notification.builder';
import { ConfigService } from '@nestjs/config';
import { NotificationTemplateBuilder } from '@src/services/external/notifme/notification.templates.builder';
import { INotificationBuilder } from '../builders/notification.builder.interface';
import { PlatformUserRegisteredAdminNotificationBuilder } from '../builders/platform/platform.user.registered.admin.notification.builder';
import { SpaceCommunicationMessageDirectSenderNotificationBuilder } from '../builders/space/space.communication.message.direct.sender.notification.builder';
@Injectable()
export class NotificationService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(NOTIFICATIONS_PROVIDER)
    private readonly notifmeService: NotifmeSdk,
    private readonly configService: ConfigService,
    private spaceCommunityApplicationApplicantNotificationBuilder: SpaceCommunityApplicationApplicantNotificationBuilder,
    private spaceCommunityApplicationAdminNotificationBuilder: SpaceAdminCommunityApplicationReceivedNotificationBuilder,
    private spaceCommunityInvitationCreatedNotificationBuilder: USERSpaceCommunityInvitationReceivedNotificationBuilder,
    private spaceCommunityPlatformInvitationCreatedNotificationBuilder: SpaceCommunityInvitationPlatformCreatedNotificationBuilder,
    private spaceCommunicationUpdateNotificationBuilder: SpaceCommunicationUpdateNotificationBuilder,
    private spaceCommunicationMessageDirectRecipientNotificationBuilder: SpaceAdminCommunicationMessageDirectNotificationBuilder,
    private spaceCommunicationMessageDirectSenderNotificationBuilder: SpaceCommunicationMessageDirectSenderNotificationBuilder,
    private userMentionNotificationBuilder: UserMentionNotificationBuilder,
    private spaceCommunityNewMemberNotificationBuilder: SpaceCommunityNewMemberNotificationBuilder,
    private spaceCommunityNewMemberAdminNotificationBuilder: SpaceAdminCommunityNewMemberNotificationBuilder,
    private spaceCollaborationWhiteboardCreatedNotificationBuilder: SpaceCollaborationCalloutCommentNotificationBuilder,
    private spaceCollaborationPostCreatedNotificationBuilder: SpaceCollaborationCalloutContributionNotificationBuilder,
    private spaceCollaborationPostCommentNotificationBuilder: SpaceCollaborationCalloutPostContributionCommentNotificationBuilder,
    private spaceCollaborationCalloutPublishedNotificationBuilder: SpaceCollaborationCalloutPublishedNotificationBuilder,
    private userCommentReplyNotificationBuilder: UserCommentReplyNotificationBuilder,
    private spaceCommunityInvitationVirtualContributorCreatedNotificationBuilder: SpaceCommunityInvitationVirtualContributorCreatedNotificationBuilder,
    private platformForumDiscussionCreatedNotificationBuilder: PlatformForumDiscussionCreatedNotificationBuilder,
    private platformGlobalRoleChangeNotificationBuilder: PlatformGlobalRoleChangeNotificationBuilder,
    private platformUserRegisteredNotificationBuilder: PlatformUserRegisteredNotificationBuilder,
    private platformUserRegisteredAdminNotificationBuilder: PlatformUserRegisteredAdminNotificationBuilder,
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

  async sendUserSpaceCommunityApplicationNotifications(
    payload: NotificationEventPayloadSpaceCommunityApplication
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCommunityApplicationApplicantNotificationBuilder
    );
  }

  async sendSpaceCommunityApplicationAdminNotifications(
    payload: NotificationEventPayloadSpaceCommunityApplication
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCommunityApplicationAdminNotificationBuilder
    );
  }

  async sendUserSpaceCommunityInvitationNotifications(
    payload: NotificationEventPayloadSpaceCommunityInvitation
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCommunityInvitationCreatedNotificationBuilder
    );
  }

  async sendVirtualContributorInvitationCreatedNotifications(
    payload: NotificationEventPayloadSpaceCommunityInvitationVirtualContributor
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCommunityInvitationVirtualContributorCreatedNotificationBuilder
    );
  }

  async sendCommunityInvitationPlatformNotifications(
    payload: NotificationEventPayloadSpaceCommunityInvitationPlatform
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCommunityPlatformInvitationCreatedNotificationBuilder
    );
  }

  async sendUserSpaceCommunityJoinedNotifications(
    payload: NotificationEventPayloadSpaceCommunityContributor
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCommunityNewMemberNotificationBuilder
    );
  }

  async sendCommunityNewMemberAdminNotifications(
    payload: NotificationEventPayloadSpaceCommunityContributor
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCommunityNewMemberAdminNotificationBuilder
    );
  }

  async sendPlatformGlobalRoleChangeNotification(
    payload: NotificationEventPayloadPlatformGlobalRole
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.platformGlobalRoleChangeNotificationBuilder
    );
  }

  async sendUserSignUpWelcomeNotification(
    payload: NotificationEventPayloadPlatformUserRegistration
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.platformUserRegisteredNotificationBuilder
    );
  }

  async sendPlatformAdminUserProfileCreatedNotification(
    payload: NotificationEventPayloadPlatformUserRegistration
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.platformUserRegisteredAdminNotificationBuilder
    );
  }

  async sendPlatformUserRemovedNotification(
    payload: NotificationEventPayloadPlatformUserRemoved
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.platformUserRemovedNotificationBuilder
    );
  }

  async sendPlatformForumDiscussionCommentNotification(
    payload: NotificationEventPayloadPlatformForumDiscussion
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.platformForumDiscussionCommentNotificationBuilder
    );
  }

  async sendPlatformForumDiscussionCreatedNotification(
    payload: NotificationEventPayloadPlatformForumDiscussion
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.platformForumDiscussionCreatedNotificationBuilder
    );
  }

  async sendSpaceCommunicationUpdateNotification(
    payload: NotificationEventPayloadSpaceCommunicationUpdate
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCommunicationUpdateNotificationBuilder
    );
  }

  async sendUserMessageRecipientNotification(
    payload: NotificationEventPayloadUserMessageDirect
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.userMessageRecipientNotificationBuilder
    );
  }

  async sendUserMessageSenderNotification(
    payload: NotificationEventPayloadUserMessageDirect
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.userMessageSenderNotificationBuilder
    );
  }

  async sendOrganizationMessageRecipientNotification(
    payload: NotificationEventPayloadOrganizationMessageDirect
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.organizationMessageRecipientNotificationBuilder
    );
  }

  async sendOrganizationMentionNotification(
    payload: NotificationEventPayloadOrganizationMessageRoom
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.organizationMentionNotificationBuilder
    );
  }

  async sendSpaceCommunicationMessageRecipientNotification(
    payload: NotificationEventPayloadSpaceCommunicationMessageDirect
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCommunicationMessageDirectRecipientNotificationBuilder
    );
  }

  async sendSpaceCommunicationMessageSenderNotification(
    payload: NotificationEventPayloadSpaceCommunicationMessageDirect
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCommunicationMessageDirectSenderNotificationBuilder
    );
  }

  async sendSpaceCollaborationCalloutContributionCreatedNotification(
    payload: NotificationEventPayloadSpaceCollaborationCallout
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCollaborationPostCreatedNotificationBuilder
    );
  }

  async sendSpaceCollaborationCalloutCommentNotification(
    payload: NotificationEventPayloadSpaceCollaborationCallout
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCollaborationWhiteboardCreatedNotificationBuilder
    );
  }

  async sendSpaceCollaborationCalloutPostContributionCommentNotification(
    payload: NotificationEventPayloadSpaceCollaborationCallout
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCollaborationPostCommentNotificationBuilder
    );
  }

  async sendSpaceCollaborationCalloutPublishedNotification(
    payload: NotificationEventPayloadSpaceCollaborationCallout
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.spaceCollaborationCalloutPublishedNotificationBuilder
    );
  }

  async sendUserCommentReplyNotification(
    payload: NotificationEventPayloadUserMessageRoomReply
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.userCommentReplyNotificationBuilder
    );
  }

  async sendUserMentionNotification(
    payload: NotificationEventPayloadUserMessageRoom
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.userMentionNotificationBuilder
    );
  }

  async sendPlatformSpaceCreatedNotification(
    payload: NotificationEventPayloadPlatformSpaceCreated
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
