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
import { User } from '@src/core/models';
import { BaseEmailPayload } from '@src/services/notification/email-template-payload/base.email.payload';
import { NotificationEvent } from '@src/generated/alkemio-schema';
import { NotificationEmailPayloadBuilderService } from './notification.email.payload.builder.service';
import { EventPayloadNotProvidedException } from '@src/common/exceptions/event.payload.not.provided.exception';
import { Channel, Message } from 'amqplib';
import { Ctx, Payload, RmqContext } from '@nestjs/microservices';
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
    @Payload() eventPayload: BaseEventPayload,
    @Ctx() context: RmqContext
  ) {
    const eventName = eventPayload.eventType;
    this.logger.verbose?.(
      `[Event received: ${eventName}]: ${JSON.stringify(eventPayload)}`,
      LogContext.NOTIFICATIONS
    );

    const sentNotifications =
      await this.buildAndSendEmailNotifications(eventPayload);

    const channel: Channel = context.getChannelRef();
    const originalMsg = context.getMessage() as Message;

    // https://www.squaremobius.net/amqp.node/channel_api.html#channel_nack
    try {
      const x = await sentNotifications;
      if (x.length === 0) {
        this.logger.verbose?.(
          `[${eventPayload.eventType}] No messages to send!`,
          LogContext.NOTIFICATIONS
        );
        channel.ack(originalMsg);
        return;
      }
      const nacked = x.filter(
        (y: { status: string }) => y.status === 'rejected'
      ) as PromiseRejectedResult[];

      if (nacked.length === 0) {
        this.logger.verbose?.(
          `[${eventPayload.eventType}] ${x.length} messages successfully sent!`,
          LogContext.NOTIFICATIONS
        );
        // if all is fine, acknowledge the given message. allUpTo (second, optional parameter) defaults to false,
        // so only the message supplied is acknowledged.
        channel.ack(originalMsg);
      } else {
        if (nacked.length === x.length) {
          this.logger.verbose?.('All messages failed to be sent!');
          // if all messages failed to be sent, we reject the message but we make sure the message is
          // not discarded so we provide 'true' to requeue parameter
          channel.reject(originalMsg, true);
        } else {
          this.logger.verbose?.(
            `${nacked.length} messages out of total ${x.length} messages failed to be sent!`,
            LogContext.NOTIFICATIONS
          );
          // if at least one message is sent successfully, we acknowledge just this message but we make sure the message is
          // dead-lettered / discarded, providing 'false' to the 3rd parameter, requeue
          channel.nack(originalMsg, false, false);
        }
        // print all rejected notifications
        nacked.forEach(x => this.logger?.warn(x.reason));
      }
    } catch (err) {
      // if there is an unhandled bug in the flow, we reject the message but we make sure the message is
      // not discarded so we provide 'true' to requeue parameter
      // channel.reject(originalMsg, true);
      channel.nack(originalMsg, false, false);
      this.logger.error(err);
    }
  }

  public async buildAndSendEmailNotifications(
    payload: BaseEventPayload
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

    const emailTemplate = this.getEmailTemplateToUseForEvent(
      payload.eventType as NotificationEvent
    );

    for (const recipient of payload.recipients) {
      const templatePayload = this.createEmailPayloadForEvent(
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

  private createEmailPayloadForEvent(
    eventPayload: BaseEventPayload,
    recipient: User
  ): BaseEmailPayload {
    // Each eventPayload has the event type
    switch (eventPayload.eventType) {
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
      case NotificationEvent.UserSpaceCommunityApplicationDeclined:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadUserSpaceCommunityApplicationDeclined(
          eventPayload as NotificationEventPayloadSpaceCommunityApplication,
          recipient
        );
      case NotificationEvent.VirtualContributorAdminSpaceCommunityInvitation:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadVirtualContributorInvitation(
          eventPayload as NotificationEventPayloadSpaceCommunityInvitationVirtualContributor,
          recipient
        );
      case NotificationEvent.VirtualContributorAdminSpaceCommunityInvitationDeclined:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadVirtualContributorInvitationDeclined(
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
          `EmailPayload: Unable to recognize event:  ${eventPayload.eventType}`,
          LogContext.NOTIFICATION_BUILDER
        );
    }
  }

  private getEmailTemplateToUseForEvent(event: NotificationEvent): string {
    switch (event) {
      case NotificationEvent.SpaceAdminCommunityApplication.valueOf():
        return 'space.admin.community.user.application.received';
      case NotificationEvent.UserSpaceCommunityInvitation.valueOf():
        return 'user.space.community.invitation.received';
      case NotificationEvent.UserSpaceCommunityApplicationDeclined.valueOf():
        return 'user.space.community.application.declined';
      case NotificationEvent.VirtualContributorAdminSpaceCommunityInvitation.valueOf():
        return 'virtual.contributor.invitation.received';
      case NotificationEvent.VirtualContributorAdminSpaceCommunityInvitationDeclined.valueOf():
        return 'virtual.contributor.invitation.declined';
      case NotificationEvent.SpaceCommunityInvitationUserPlatform.valueOf():
        return 'user.space.community.invitation.received';
      case NotificationEvent.UserSpaceCommunityJoined.valueOf():
        return 'user.space.community.joined';
      case NotificationEvent.SpaceAdminCommunityNewMember.valueOf():
        return 'space.admin.community.new.member';
      case NotificationEvent.PlatformAdminGlobalRoleChanged.valueOf():
        return 'platform.admin.user.global.role.change';
      case NotificationEvent.UserSignUpWelcome.valueOf():
        return 'user.sign.up.welcome';
      case NotificationEvent.PlatformAdminUserProfileCreated.valueOf():
        return 'platform.admin.user.profile.created';
      case NotificationEvent.PlatformAdminUserProfileRemoved.valueOf():
        return 'platform.admin.user.profile.removed';
      case NotificationEvent.SpaceCommunicationUpdate.valueOf():
        return 'space.communication.update.member';
      case NotificationEvent.PlatformForumDiscussionCreated.valueOf():
        return 'platform.forum.discussion.created';
      case NotificationEvent.PlatformForumDiscussionComment.valueOf():
        return 'platform.forum.discussion.comment';
      case NotificationEvent.UserMessage.valueOf():
        return 'user.message.recipient';
      case NotificationEvent.UserMessageSender.valueOf():
        return 'user.message.sender';
      case NotificationEvent.OrganizationAdminMessage.valueOf():
        return 'organization.message.recipient';
      case NotificationEvent.OrganizationMessageSender.valueOf():
        return 'organization.message.sender';
      case NotificationEvent.SpaceLeadCommunicationMessage.valueOf():
        return 'space.lead.communication.message.direct.receiver';
      case NotificationEvent.UserMentioned.valueOf():
        return 'user.mention';
      case NotificationEvent.OrganizationAdminMentioned.valueOf():
        return 'organization.mention';
      case NotificationEvent.SpaceCollaborationCalloutComment.valueOf():
        return 'space.collaboration.callout.comment';
      case NotificationEvent.SpaceCollaborationCalloutContribution.valueOf():
        return 'space.collaboration.callout.contribution';
      case NotificationEvent.SpaceAdminCollaborationCalloutContribution.valueOf():
        return 'space.admin.collaboration.callout.contribution';
      case NotificationEvent.SpaceCollaborationCalloutPostContributionComment.valueOf():
        return 'space.collaboration.callout.post.contribution.comment';
      case NotificationEvent.SpaceCollaborationCalloutPublished.valueOf():
        return 'space.collaboration.callout.published';
      case NotificationEvent.UserCommentReply.valueOf():
        return 'user.comment.reply';
      case NotificationEvent.PlatformAdminSpaceCreated.valueOf():
        return 'platform.admin.space.created';
      default:
        throw new EventPayloadNotProvidedException(
          `Email template: Unable to recognize event: ${event}`,
          LogContext.NOTIFICATION_BUILDER
        );
    }
  }

  private isPromiseFulfilledResult = (
    result: PromiseSettledResult<any>
  ): result is PromiseFulfilledResult<any> => result.status === 'fulfilled';
}
