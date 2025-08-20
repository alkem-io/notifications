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
  SpaceCommunityApplicationCreatedEventPayload,
  NotificationEventPayloadSpaceCommunityInvitation,
  SpaceCommunityInvitationVirtualContributorCreatedEventPayload,
  SpaceCommunityNewMemberPayload,
  NotificationEventPayloadSpaceCommunicationMessageDirect,
  NotificationEventPayloadSpaceCommunicationUpdate,
  UserMentionEventPayload,
  NotificationEventPayloadSpaceCollaborationCallout,
  UserCommentReplyEventPayload,
  SpaceCommunityPlatformInvitationCreatedEventPayload,
} from '@alkemio/notifications-lib';
import { NotificationService } from './services/domain/notification/notification.service';
import { ALKEMIO_CLIENT_ADAPTER, LogContext } from './common/enums';
import { AlkemioClientAdapter } from './services';
import { NotificationEvent } from './generated/graphql';

@Controller()
export class AppController {
  constructor(
    private notificationService: NotificationService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(ALKEMIO_CLIENT_ADAPTER)
    private readonly featureFlagProvider: AlkemioClientAdapter
  ) {}

  @EventPattern(NotificationEvent.SpaceCommunityApplicationApplicant)
  async sendSpaceCommunityApplicationRecipientNotification(
    @Payload() eventPayload: SpaceCommunityApplicationCreatedEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendSpaceCommunityApplicationApplicantNotifications(
        eventPayload
      ),
      NotificationEvent.SpaceCommunityApplicationApplicant
    );
  }

  @EventPattern(NotificationEvent.SpaceCommunityApplicationAdmin)
  async sendSpaceCommunityApplicationAdminNotification(
    @Payload() eventPayload: SpaceCommunityApplicationCreatedEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendSpaceCommunityApplicationAdminNotifications(
        eventPayload
      ),
      NotificationEvent.SpaceCommunityApplicationAdmin
    );
  }

  @EventPattern(NotificationEvent.SpaceCommunityInvitationUser.valueOf())
  async sendSpaceCommunityInvitationNotification(
    // todo is auto validation possible
    @Payload() eventPayload: NotificationEventPayloadSpaceCommunityInvitation,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendSpaceCommunityInvitationUserNotifications(
        eventPayload
      ),
      NotificationEvent.SpaceCommunityInvitationUser
    );
  }

  @EventPattern(NotificationEvent.SpaceCommunityInvitationVc)
  async sendSpaceCommunityVirtualContributorInvitationCreatedNotifications(
    @Payload()
    eventPayload: SpaceCommunityInvitationVirtualContributorCreatedEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendVirtualContributorInvitationCreatedNotifications(
        eventPayload
      ),
      NotificationEvent.SpaceCommunityInvitationVc
    );
  }

  @EventPattern(NotificationEvent.SpaceCommunityInvitationUserPlatform)
  async sendCommunityPlatformInvitationNotification(
    // todo is auto validation possible
    @Payload()
    eventPayload: SpaceCommunityPlatformInvitationCreatedEventPayload,
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

  @EventPattern(NotificationEvent.SpaceCommunityNewMember)
  async sendCommunityNewMemberNotification(
    // todo is auto validation possible
    @Payload() eventPayload: SpaceCommunityNewMemberPayload,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendCommunityNewMemberNotifications(
        eventPayload
      ),
      NotificationEvent.SpaceCommunityNewMember
    );
  }

  @EventPattern(NotificationEvent.SpaceCommunityNewMemberAdmin)
  async sendCommunityNewMemberAdminNotification(
    // todo is auto validation possible
    @Payload() eventPayload: SpaceCommunityNewMemberPayload,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendCommunityNewMemberAdminNotifications(
        eventPayload
      ),
      NotificationEvent.SpaceCommunityNewMemberAdmin
    );
  }

  @EventPattern(NotificationEvent.PlatformGlobalRoleChange)
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
      NotificationEvent.PlatformGlobalRoleChange
    );
  }

  @EventPattern(NotificationEvent.PlatformUserProfileCreated)
  async sendPlatformUserRegisteredNotification(
    // todo is auto validation possible
    @Payload() eventPayload: NotificationEventPayloadPlatformUserRegistration,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendPlatformUserRegisteredNotification(
        eventPayload
      ),
      NotificationEvent.PlatformUserProfileCreated
    );
  }

  @EventPattern(NotificationEvent.PlatformUserProfileCreatedAdmin)
  async sendPlatformUserRegisteredAdminNotification(
    // todo is auto validation possible
    @Payload() eventPayload: NotificationEventPayloadPlatformUserRegistration,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendPlatformUserRegisteredNotification(
        eventPayload
      ),
      NotificationEvent.PlatformUserProfileCreatedAdmin
    );
  }

  @EventPattern(NotificationEvent.PlatformUserProfileRemoved)
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
      NotificationEvent.PlatformUserProfileRemoved
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

  @EventPattern(NotificationEvent.SpaceCommunicationUpdateAdmin)
  async sendSpaceCommunicationUpdateAdminNotifications(
    // todo is auto validation possible
    @Payload()
    eventPayload: NotificationEventPayloadSpaceCommunicationUpdate,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendSpaceCommunicationUpdateAdminNotification(
        eventPayload
      ),
      NotificationEvent.SpaceCommunicationUpdateAdmin
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

  @EventPattern(NotificationEvent.UserMessageRecipient)
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
      NotificationEvent.UserMessageRecipient
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

  @EventPattern(NotificationEvent.OrganizationMessageRecipient)
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
      NotificationEvent.OrganizationMessageRecipient
    );
  }

  @EventPattern(NotificationEvent.SpaceCommunicationMessageRecipient)
  async sendCommunicationCommunityLeadsMessageNotifications(
    @Payload()
    eventPayload: NotificationEventPayloadSpaceCommunicationMessageDirect,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendSpaceCommunicationMessageNotification(
        eventPayload
      ),
      NotificationEvent.SpaceCommunicationMessageRecipient
    );
  }

  @EventPattern(NotificationEvent.UserMention)
  async sendUserMentionNotifications(
    @Payload() eventPayload: UserMentionEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendUserMentionNotification(eventPayload),
      NotificationEvent.UserMention
    );
  }

  @EventPattern(NotificationEvent.OrganizationMentioned)
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
      NotificationEvent.OrganizationMentioned
    );
  }

  @EventPattern(
    NotificationEvent.SpaceCollaborationWhiteboardCreated,
    Transport.RMQ
  )
  async sendWhiteboardCreatedNotifications(
    @Payload() eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendSpaceCollaborationWhiteboardCreatedNotification(
        eventPayload
      ),
      NotificationEvent.SpaceCollaborationWhiteboardCreated
    );
  }

  @EventPattern(NotificationEvent.SpaceCollaborationPostCreated, Transport.RMQ)
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
      NotificationEvent.SpaceCollaborationPostCreated
    );
  }

  @EventPattern(
    NotificationEvent.SpaceCollaborationPostCommentCreated,
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
      NotificationEvent.SpaceCollaborationPostCommentCreated
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
    @Payload() eventPayload: UserCommentReplyEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.processSent(
      eventPayload,
      context,
      this.notificationService.sendUserCommentReplyNotification(eventPayload),
      NotificationEvent.UserCommentReply
    );
  }

  @EventPattern(NotificationEvent.PlatformSpaceCreated)
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
      NotificationEvent.PlatformSpaceCreated
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

    if (!(await this.featureFlagProvider.areNotificationsEnabled())) {
      channel.ack(originalMsg);
      return;
    }

    // https://www.squaremobius.net/amqp.node/channel_api.html#channel_nack
    sentNotifications
      .then(x => {
        const nacked = x.filter(
          (y: { status: string }) => y.status === 'rejected'
        ) as PromiseRejectedResult[];

        if (nacked.length === 0) {
          this.logger.verbose?.(`All ${x.length} messages successfully sent!`);
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
              `${nacked.length} messages out of total ${x.length} messages failed to be sent!`
            );
            // if at least one message is sent successfully, we acknowledge just this message but we make sure the message is
            // dead-lettered / discarded, providing 'false' to the 3rd parameter, requeue
            channel.nack(originalMsg, false, false);
          }
          // print all rejected notifications
          nacked.forEach(x => this.logger?.warn(x.reason));
        }
      })
      .catch(err => {
        // if there is an unhandled bug in the flow, we reject the message but we make sure the message is
        // not discarded so we provide 'true' to requeue parameter
        // channel.reject(originalMsg, true);
        channel.nack(originalMsg, false, false);
        this.logger.error(err);
      });
  }
}
