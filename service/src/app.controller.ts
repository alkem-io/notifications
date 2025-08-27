import { Controller, Inject, LoggerService } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  Payload,
  RmqContext,
  Transport,
} from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Channel, Message } from 'amqplib';
import {
  NotificationEventPayloadPlatformUserRemoved,
  NotificationEventPayloadPlatformForumDiscussion,
  NotificationEventPayloadPlatformGlobalRole,
  NotificationEventPayloadPlatformUserRegistration,
  NotificationEventPayloadPlatformSpaceCreated,
  BaseEventPayload,
  NotificationEventPayloadOrganizationMessageDirect,
  NotificationEventPayloadOrganizationMessageRoom,
  NotificationEventPayloadUserMessageDirect,
  NotificationEventPayloadSpaceCommunityInvitation,
  NotificationEventPayloadSpaceCommunicationMessageDirect,
  NotificationEventPayloadSpaceCommunicationUpdate,
  NotificationEventPayloadSpaceCollaborationCallout,
  NotificationEventPayloadSpaceCommunityApplication,
  NotificationEventPayloadSpaceCommunityInvitationVirtualContributor,
  NotificationEventPayloadSpaceCommunityInvitationPlatform,
  NotificationEventPayloadSpaceCommunityContributor,
  NotificationEventPayloadUserMessageRoomReply,
  NotificationEventPayloadUserMessageRoom,
} from '@alkemio/notifications-lib';
import { NotificationService } from './services/notification/notification.service';
import { LogContext } from './common/enums/logging.context';
import { NotificationEvent } from './generated/alkemio-schema';

@Controller()
export class AppController {
  constructor(
    private notificationService: NotificationService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService
  ) {}

  // todo is auto validation of payloads possible/

  @EventPattern(NotificationEvent.UserSpaceCommunityApplication)
  async sendSpaceCommunityApplicationRecipientNotification(
    @Payload() eventPayload: NotificationEventPayloadSpaceCommunityApplication,
    @Ctx() context: RmqContext
  ) {
    this.processSent(eventPayload, context);
  }

  @EventPattern(NotificationEvent.SpaceAdminCommunityApplication)
  async sendSpaceCommunityApplicationAdminNotification(
    @Payload() eventPayload: NotificationEventPayloadSpaceCommunityApplication,
    @Ctx() context: RmqContext
  ) {
    this.processSent(eventPayload, context);
  }

  @EventPattern(NotificationEvent.UserSpaceCommunityInvitation)
  async sendSpaceCommunityInvitationNotification(
    @Payload() eventPayload: NotificationEventPayloadSpaceCommunityInvitation,
    @Ctx() context: RmqContext
  ) {
    this.processSent(eventPayload, context);
  }

  @EventPattern(
    NotificationEvent.VirtualContributorAdminSpaceCommunityInvitation
  )
  async sendSpaceCommunityVirtualContributorInvitationCreatedNotifications(
    @Payload()
    eventPayload: NotificationEventPayloadSpaceCommunityInvitationVirtualContributor,
    @Ctx() context: RmqContext
  ) {
    this.processSent(eventPayload, context);
  }

  @EventPattern(NotificationEvent.SpaceCommunityInvitationUserPlatform)
  async sendCommunityPlatformInvitationNotification(
    @Payload()
    eventPayload: NotificationEventPayloadSpaceCommunityInvitationPlatform,
    @Ctx() context: RmqContext
  ) {
    this.processSent(eventPayload, context);
  }

  @EventPattern(NotificationEvent.UserSpaceCommunityJoined)
  async sendCommunityNewMemberNotification(
    @Payload() eventPayload: NotificationEventPayloadSpaceCommunityContributor,
    @Ctx() context: RmqContext
  ) {
    this.processSent(eventPayload, context);
  }

  @EventPattern(NotificationEvent.SpaceAdminCommunityNewMember)
  async sendCommunityNewMemberAdminNotification(
    @Payload() eventPayload: NotificationEventPayloadSpaceCommunityContributor,
    @Ctx() context: RmqContext
  ) {
    this.processSent(eventPayload, context);
  }

  @EventPattern(NotificationEvent.PlatformAdminGlobalRoleChanged)
  async sendPlatformGlobalRoleChangeNotification(
    @Payload() eventPayload: NotificationEventPayloadPlatformGlobalRole,
    @Ctx() context: RmqContext
  ) {
    this.processSent(eventPayload, context);
  }

  @EventPattern(NotificationEvent.UserSignUpWelcome)
  async sendUserSignUpWelcomeNotification(
    @Payload() eventPayload: NotificationEventPayloadPlatformUserRegistration,
    @Ctx() context: RmqContext
  ) {
    this.processSent(eventPayload, context);
  }

  @EventPattern(NotificationEvent.PlatformAdminUserProfileCreated)
  async sendPlatformUserRegisteredAdminNotification(
    @Payload() eventPayload: NotificationEventPayloadPlatformUserRegistration,
    @Ctx() context: RmqContext
  ) {
    this.processSent(eventPayload, context);
  }

  @EventPattern(NotificationEvent.PlatformAdminUserProfileRemoved)
  async sendUserRemovedNotification(
    @Payload() eventPayload: NotificationEventPayloadPlatformUserRemoved,
    @Ctx() context: RmqContext
  ) {
    this.processSent(eventPayload, context);
  }

  @EventPattern(NotificationEvent.SpaceCommunicationUpdate)
  async sendSpaceCommunicationUpdateNotifications(
    @Payload()
    eventPayload: NotificationEventPayloadSpaceCommunicationUpdate,
    @Ctx() context: RmqContext
  ) {
    this.processSent(eventPayload, context);
  }

  @EventPattern(NotificationEvent.PlatformForumDiscussionCreated)
  async sendPlatformForumDiscussionCreatedNotifications(
    @Payload() eventPayload: NotificationEventPayloadPlatformForumDiscussion,
    @Ctx() context: RmqContext
  ) {
    this.processSent(eventPayload, context);
  }

  @EventPattern(NotificationEvent.PlatformForumDiscussionComment)
  async sendPlatformForumDiscussionCommentNotifications(
    @Payload() eventPayload: NotificationEventPayloadPlatformForumDiscussion,
    @Ctx() context: RmqContext
  ) {
    this.processSent(eventPayload, context);
  }

  @EventPattern(NotificationEvent.UserMessage)
  async sendUserMessageNotifications(
    @Payload() eventPayload: NotificationEventPayloadUserMessageDirect,
    @Ctx() context: RmqContext
  ) {
    this.processSent(eventPayload, context);
  }

  @EventPattern(NotificationEvent.UserMessageSender)
  async sendUserMessageSenderNotifications(
    @Payload() eventPayload: NotificationEventPayloadUserMessageDirect,
    @Ctx() context: RmqContext
  ) {
    this.processSent(eventPayload, context);
  }

  @EventPattern(NotificationEvent.OrganizationAdminMessage)
  async sendOrganizationMessageRecipientNotifications(
    @Payload() eventPayload: NotificationEventPayloadOrganizationMessageDirect,
    @Ctx() context: RmqContext
  ) {
    this.processSent(eventPayload, context);
  }

  @EventPattern(NotificationEvent.OrganizationMessageSender)
  async sendOrganizationMessageSenderNotifications(
    @Payload() eventPayload: NotificationEventPayloadOrganizationMessageDirect,
    @Ctx() context: RmqContext
  ) {
    this.processSent(eventPayload, context);
  }

  @EventPattern(NotificationEvent.SpaceLeadCommunicationMessage)
  async sendSpaceCommunicationMessageRecipientNotifications(
    @Payload()
    eventPayload: NotificationEventPayloadSpaceCommunicationMessageDirect,
    @Ctx() context: RmqContext
  ) {
    this.processSent(eventPayload, context);
  }

  @EventPattern(NotificationEvent.SpaceCommunicationMessageSender)
  async sendSpaceCommunicationMessageSenderNotifications(
    @Payload()
    eventPayload: NotificationEventPayloadSpaceCommunicationMessageDirect,
    @Ctx() context: RmqContext
  ) {
    this.processSent(eventPayload, context);
  }

  @EventPattern(NotificationEvent.UserMentioned)
  async sendUserMentionNotifications(
    @Payload() eventPayload: NotificationEventPayloadUserMessageRoom,
    @Ctx() context: RmqContext
  ) {
    this.processSent(eventPayload, context);
  }

  @EventPattern(NotificationEvent.OrganizationAdminMentioned)
  async sendOrganizationMentionNotifications(
    @Payload() eventPayload: NotificationEventPayloadOrganizationMessageRoom,
    @Ctx() context: RmqContext
  ) {
    this.processSent(eventPayload, context);
  }

  @EventPattern(
    NotificationEvent.SpaceCollaborationCalloutComment,
    Transport.RMQ
  )
  async sendSpaceCollaborationCalloutCommentNotifications(
    @Payload() eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    @Ctx() context: RmqContext
  ) {
    this.processSent(eventPayload, context);
  }

  @EventPattern(
    NotificationEvent.SpaceCollaborationCalloutContribution,
    Transport.RMQ
  )
  async sendSpaceCollaborationCalloutContributionNotifications(
    @Payload() eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    @Ctx() context: RmqContext
  ) {
    this.processSent(eventPayload, context);
  }

  @EventPattern(
    NotificationEvent.SpaceAdminCollaborationCalloutContribution,
    Transport.RMQ
  )
  async sendSpaceAdminCollaborationCalloutContributionNotifications(
    @Payload() eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    @Ctx() context: RmqContext
  ) {
    this.processSent(eventPayload, context);
  }

  @EventPattern(
    NotificationEvent.SpaceCollaborationCalloutPostContributionComment,
    Transport.RMQ
  )
  async sendPostCommentCreatedNotifications(
    @Payload() eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    @Ctx() context: RmqContext
  ) {
    this.processSent(eventPayload, context);
  }

  @EventPattern(
    NotificationEvent.SpaceCollaborationCalloutPublished,
    Transport.RMQ
  )
  async sendCalloutPublishedNotifications(
    @Payload() eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    @Ctx() context: RmqContext
  ) {
    this.processSent(eventPayload, context);
  }

  @EventPattern(NotificationEvent.UserCommentReply, Transport.RMQ)
  async sendUserCommentReplyNotifications(
    @Payload() eventPayload: NotificationEventPayloadUserMessageRoomReply,
    @Ctx() context: RmqContext
  ) {
    this.processSent(eventPayload, context);
  }

  @EventPattern(NotificationEvent.PlatformAdminSpaceCreated)
  async sendPlatformSpaceCreatedNotifications(
    @Payload()
    eventPayload: NotificationEventPayloadPlatformSpaceCreated,
    @Ctx() context: RmqContext
  ) {
    this.processSent(eventPayload, context);
  }

  private async processSent(
    @Payload() eventPayload: BaseEventPayload,
    @Ctx() context: RmqContext
  ) {
    const eventName = eventPayload.eventType;
    this.logger.verbose?.(
      `[Event received: ${eventName}]: ${JSON.stringify(eventPayload)}`,
      LogContext.NOTIFICATIONS
    );

    const sentNotifications =
      this.notificationService.processNotificationEvent(eventPayload);

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
}
