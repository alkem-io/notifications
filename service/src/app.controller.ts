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
import { NotificationStatus } from 'notifme-sdk';
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
import { NotificationService } from './services/domain/notification/notification.service';
import { LogContext } from './common/enums/logging.context';
import { NotificationEvent } from './generated/alkemio-schema';

@Controller()
export class AppController {
  constructor(
    private notificationService: NotificationService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService
  ) {}

  @EventPattern(NotificationEvent.UserSpaceCommunityApplication)
  async sendSpaceCommunityApplicationRecipientNotification(
    @Payload() eventPayload: NotificationEventPayloadSpaceCommunityApplication,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendUserSpaceCommunityApplicationNotifications(
        eventPayload
      ),
      NotificationEvent.UserSpaceCommunityApplication
    );
  }

  @EventPattern(NotificationEvent.SpaceAdminCommunityApplication)
  async sendSpaceCommunityApplicationAdminNotification(
    @Payload() eventPayload: NotificationEventPayloadSpaceCommunityApplication,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendSpaceCommunityApplicationAdminNotifications(
        eventPayload
      ),
      NotificationEvent.SpaceAdminCommunityApplication
    );
  }

  @EventPattern(NotificationEvent.UserSpaceCommunityInvitation)
  async sendSpaceCommunityInvitationNotification(
    // todo is auto validation possible
    @Payload() eventPayload: NotificationEventPayloadSpaceCommunityInvitation,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendUserSpaceCommunityInvitationNotifications(
        eventPayload
      ),
      NotificationEvent.UserSpaceCommunityInvitation
    );
  }

  @EventPattern(
    NotificationEvent.VirtualContributorAdminSpaceCommunityInvitation
  )
  async sendSpaceCommunityVirtualContributorInvitationCreatedNotifications(
    @Payload()
    eventPayload: NotificationEventPayloadSpaceCommunityInvitationVirtualContributor,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendVirtualContributorInvitationCreatedNotifications(
        eventPayload
      ),
      NotificationEvent.VirtualContributorAdminSpaceCommunityInvitation
    );
  }

  @EventPattern(NotificationEvent.SpaceCommunityInvitationUserPlatform)
  async sendCommunityPlatformInvitationNotification(
    // todo is auto validation possible
    @Payload()
    eventPayload: NotificationEventPayloadSpaceCommunityInvitationPlatform,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendCommunityInvitationPlatformNotifications(
        eventPayload
      ),
      NotificationEvent.SpaceCommunityInvitationUserPlatform
    );
  }

  @EventPattern(NotificationEvent.UserSpaceCommunityJoined)
  async sendCommunityNewMemberNotification(
    // todo is auto validation possible
    @Payload() eventPayload: NotificationEventPayloadSpaceCommunityContributor,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendUserSpaceCommunityJoinedNotifications(
        eventPayload
      ),
      NotificationEvent.UserSpaceCommunityJoined
    );
  }

  @EventPattern(NotificationEvent.SpaceAdminCommunityNewMember)
  async sendCommunityNewMemberAdminNotification(
    // todo is auto validation possible
    @Payload() eventPayload: NotificationEventPayloadSpaceCommunityContributor,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendCommunityNewMemberAdminNotifications(
        eventPayload
      ),
      NotificationEvent.SpaceAdminCommunityNewMember
    );
  }

  @EventPattern(NotificationEvent.PlatformAdminGlobalRoleChanged)
  async sendPlatformGlobalRoleChangeNotification(
    // todo is auto validation possible
    @Payload() eventPayload: NotificationEventPayloadPlatformGlobalRole,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendPlatformGlobalRoleChangeNotification(
        eventPayload
      ),
      NotificationEvent.PlatformAdminGlobalRoleChanged
    );
  }

  @EventPattern(NotificationEvent.UserSignUpWelcome)
  async sendUserSignUpWelcomeNotification(
    // todo is auto validation possible
    @Payload() eventPayload: NotificationEventPayloadPlatformUserRegistration,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendUserSignUpWelcomeNotification(eventPayload),
      NotificationEvent.UserSignUpWelcome
    );
  }

  @EventPattern(NotificationEvent.PlatformAdminUserProfileCreated)
  async sendPlatformUserRegisteredAdminNotification(
    // todo is auto validation possible
    @Payload() eventPayload: NotificationEventPayloadPlatformUserRegistration,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendPlatformAdminUserProfileCreatedNotification(
        eventPayload
      ),
      NotificationEvent.PlatformAdminUserProfileCreated
    );
  }

  @EventPattern(NotificationEvent.PlatformAdminUserProfileRemoved)
  async sendUserRemovedNotification(
    // todo is auto validation possible
    @Payload() eventPayload: NotificationEventPayloadPlatformUserRemoved,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendPlatformUserRemovedNotification(
        eventPayload
      ),
      NotificationEvent.PlatformAdminUserProfileRemoved
    );
  }

  @EventPattern(NotificationEvent.SpaceCommunicationUpdate)
  async sendSpaceCommunicationUpdateNotifications(
    // todo is auto validation possible
    @Payload()
    eventPayload: NotificationEventPayloadSpaceCommunicationUpdate,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendSpaceCommunicationUpdateNotification(
        eventPayload
      ),
      NotificationEvent.SpaceCommunicationUpdate
    );
  }

  @EventPattern(NotificationEvent.PlatformForumDiscussionCreated)
  async sendPlatformForumDiscussionCreatedNotifications(
    // todo is auto validation possible
    @Payload() eventPayload: NotificationEventPayloadPlatformForumDiscussion,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendPlatformForumDiscussionCreatedNotification(
        eventPayload
      ),
      NotificationEvent.PlatformForumDiscussionCreated
    );
  }

  @EventPattern(NotificationEvent.PlatformForumDiscussionComment)
  async sendPlatformForumDiscussionCommentNotifications(
    @Payload() eventPayload: NotificationEventPayloadPlatformForumDiscussion,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendPlatformForumDiscussionCommentNotification(
        eventPayload
      ),
      NotificationEvent.PlatformForumDiscussionComment
    );
  }

  @EventPattern(NotificationEvent.UserMessage)
  async sendUserMessageNotifications(
    @Payload() eventPayload: NotificationEventPayloadUserMessageDirect,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendUserMessageRecipientNotification(
        eventPayload
      ),
      NotificationEvent.UserMessage
    );
  }

  @EventPattern(NotificationEvent.UserMessageSender)
  async sendUserMessageSenderNotifications(
    @Payload() eventPayload: NotificationEventPayloadUserMessageDirect,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendUserMessageSenderNotification(eventPayload),
      NotificationEvent.UserMessageSender
    );
  }

  @EventPattern(NotificationEvent.OrganizationAdminMessage)
  async sendCommunicationOrganizationMessageNotifications(
    @Payload() eventPayload: NotificationEventPayloadOrganizationMessageDirect,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendOrganizationMessageRecipientNotification(
        eventPayload
      ),
      NotificationEvent.OrganizationAdminMessage
    );
  }

  @EventPattern(NotificationEvent.SpaceAdminCommunicationMessage)
  async sendSpaceCommunicationMessageRecipientNotifications(
    @Payload()
    eventPayload: NotificationEventPayloadSpaceCommunicationMessageDirect,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendSpaceCommunicationMessageRecipientNotification(
        eventPayload
      ),
      NotificationEvent.SpaceAdminCommunicationMessage
    );
  }

  @EventPattern(NotificationEvent.SpaceCommunicationMessageSender)
  async sendSpaceCommunicationMessageSenderNotifications(
    @Payload()
    eventPayload: NotificationEventPayloadSpaceCommunicationMessageDirect,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendSpaceCommunicationMessageSenderNotification(
        eventPayload
      ),
      NotificationEvent.SpaceCommunicationMessageSender
    );
  }

  @EventPattern(NotificationEvent.UserMentioned)
  async sendUserMentionNotifications(
    @Payload() eventPayload: NotificationEventPayloadUserMessageRoom,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendUserMentionNotification(eventPayload),
      NotificationEvent.UserMentioned
    );
  }

  @EventPattern(NotificationEvent.OrganizationAdminMentioned)
  async sendOrganizationMentionNotifications(
    @Payload() eventPayload: NotificationEventPayloadOrganizationMessageRoom,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendOrganizationMentionNotification(
        eventPayload
      ),
      NotificationEvent.OrganizationAdminMentioned
    );
  }

  @EventPattern(
    NotificationEvent.SpaceCollaborationCalloutComment,
    Transport.RMQ
  )
  async sendSpaceCollaborationCalloutCommentNotifications(
    @Payload() eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendSpaceCollaborationWhiteboardCreatedNotification(
        eventPayload
      ),
      NotificationEvent.SpaceCollaborationCalloutComment
    );
  }

  @EventPattern(
    NotificationEvent.SpaceCollaborationCalloutContribution,
    Transport.RMQ
  )
  async sendPostCreatedNotifications(
    @Payload() eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendSpaceCollaborationPostCreatedNotification(
        eventPayload
      ),
      NotificationEvent.SpaceCollaborationCalloutContribution
    );
  }

  @EventPattern(
    NotificationEvent.SpaceCollaborationCalloutPostContributionComment,
    Transport.RMQ
  )
  async sendPostCommentCreatedNotifications(
    @Payload() eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendSpaceCollaborationPostCommentCreatedNotification(
        eventPayload
      ),
      NotificationEvent.SpaceCollaborationCalloutPostContributionComment
    );
  }

  @EventPattern(
    NotificationEvent.SpaceCollaborationCalloutPublished,
    Transport.RMQ
  )
  async sendCalloutPublishedNotifications(
    @Payload() eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendSpaceCollaborationCalloutPublishedNotification(
        eventPayload
      ),
      NotificationEvent.SpaceCollaborationCalloutPublished
    );
  }

  @EventPattern(NotificationEvent.UserCommentReply, Transport.RMQ)
  async sendUserCommentReplyNotifications(
    @Payload() eventPayload: NotificationEventPayloadUserMessageRoomReply,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendUserCommentReplyNotification(eventPayload),
      NotificationEvent.UserCommentReply
    );
  }

  @EventPattern(NotificationEvent.PlatformAdminSpaceCreated)
  async sendPlatformSpaceCreatedNotifications(
    @Payload()
    eventPayload: NotificationEventPayloadPlatformSpaceCreated,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendPlatformSpaceCreatedNotification(
        eventPayload
      ),
      NotificationEvent.PlatformAdminSpaceCreated
    );
  }

  private async processSent(
    @Payload() eventPayload: BaseEventPayload,
    @Ctx() context: RmqContext,
    sentNotifications: Promise<PromiseSettledResult<NotificationStatus>[]>,
    eventName: string
  ) {
    this.logger.verbose?.(
      `[Event received: ${eventName}]: ${JSON.stringify(eventPayload)}`,
      LogContext.NOTIFICATIONS
    );

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
