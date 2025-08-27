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
import { NotificationNoChannelsException } from '@src/common/exceptions';
import { ConfigService } from '@nestjs/config';
import { NotificationTemplateBuilder } from '@src/services/notifme/notification.templates.builder';
import { EmailTemplate } from '@src/common/enums/email.template';
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

    private notificationTemplateBuilder: NotificationTemplateBuilder,
    private notificationEmailPayloadBuilderService: NotificationEmailPayloadBuilderService
  ) {}

  public async processNotificationEvent(
    payload: BaseEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    const emailTemplate = this.getEmailTemplateToUseForEvent(payload.eventType);
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

  public getEmailTemplateToUseForEvent(event: string): EmailTemplate {
    switch (event) {
      case NotificationEvent.UserSpaceCommunityApplication:
        return EmailTemplate.USER_SPACE_COMMUNITY_APPLICATION_SUBMITTED;
      case NotificationEvent.SpaceAdminCommunityApplication:
        return EmailTemplate.SPACE_ADMIN_COMMUNITY_USER_APPLICATION_RECEIVED;
      case NotificationEvent.UserSpaceCommunityInvitation:
        return EmailTemplate.USER_SPACE_COMMUNITY_INVITATION_RECEIVED;
      case NotificationEvent.VirtualContributorAdminSpaceCommunityInvitation:
        return EmailTemplate.VIRTUAL_CONTRIBUTOR_INVITATION_RECEIVED;
      case NotificationEvent.SpaceCommunityInvitationUserPlatform:
        return EmailTemplate.USER_SPACE_COMMUNITY_INVITATION_RECEIVED;
      case NotificationEvent.UserSpaceCommunityJoined:
        return EmailTemplate.USER_SPACE_COMMUNITY_JOINED;
      case NotificationEvent.SpaceAdminCommunityNewMember:
        return EmailTemplate.SPACE_ADMIN_COMMUNITY_NEW_MEMBER;
      case NotificationEvent.PlatformAdminGlobalRoleChanged:
        return EmailTemplate.PLATFORM_ADMIN_USER_GLOBAL_ROLE_CHANGE;
      case NotificationEvent.UserSignUpWelcome:
        return EmailTemplate.USER_SIGN_UP_WELCOME;
      case NotificationEvent.PlatformAdminUserProfileCreated:
        return EmailTemplate.PLATFORM_ADMIN_USER_PROFILE_CREATED;
      case NotificationEvent.PlatformAdminUserProfileRemoved:
        return EmailTemplate.PLATFORM_ADMIN_USER_PROFILE_REMOVED;
      default:
        throw new EventPayloadNotProvidedException(
          'Event payload not provided',
          LogContext.NOTIFICATION_BUILDER
        );
    }
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
