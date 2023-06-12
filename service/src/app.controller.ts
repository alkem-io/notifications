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
import { IFeatureFlagProvider } from '@core/contracts';
import {
  NotificationEventType,
  PlatformUserRemovedEventPayload,
  CommunityApplicationCreatedEventPayload,
  CollaborationCardCommentEventPayload,
  CollaborationCardCreatedEventPayload,
  PlatformForumDiscussionCreatedEventPayload,
  CommunicationUserMessageEventPayload,
  CommunicationOrganizationMessageEventPayload,
  CommunicationCommunityLeadsMessageEventPayload,
  CommunicationUserMentionEventPayload,
  CommunicationOrganizationMentionEventPayload,
  CommunicationUpdateEventPayload,
  CollaborationContextReviewSubmittedPayload,
  CommunityNewMemberPayload,
  CollaborationInterestPayload,
  PlatformUserRegistrationEventPayload,
  CollaborationCalloutPublishedEventPayload,
  BaseEventPayload,
  CollaborationWhiteboardCreatedEventPayload,
  CollaborationDiscussionCommentEventPayload,
  PlatformForumDiscussionCommentEventPayload,
  CommunityInvitationCreatedEventPayload,
} from '@alkemio/notifications-lib';
import { NotificationService } from './services/domain/notification/notification.service';
import { ALKEMIO_CLIENT_ADAPTER, LogContext } from './common/enums';

@Controller()
export class AppController {
  constructor(
    private notificationService: NotificationService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(ALKEMIO_CLIENT_ADAPTER)
    private readonly featureFlagProvider: IFeatureFlagProvider
  ) {}

  @EventPattern(NotificationEventType.COMMUNITY_APPLICATION_CREATED)
  async sendApplicationNotification(
    // todo is auto validation possible
    @Payload() eventPayload: CommunityApplicationCreatedEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.sendNotifications(
      eventPayload,
      context,
      this.notificationService.sendApplicationCreatedNotifications(
        eventPayload
      ),
      NotificationEventType.COMMUNITY_APPLICATION_CREATED
    );
  }

  @EventPattern(NotificationEventType.COMMUNITY_INVITATION_CREATED)
  async sendInvitationNotification(
    // todo is auto validation possible
    @Payload() eventPayload: CommunityInvitationCreatedEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.sendNotifications(
      eventPayload,
      context,
      this.notificationService.sendInvitationCreatedNotifications(eventPayload),
      NotificationEventType.COMMUNITY_INVITATION_CREATED
    );
  }

  @EventPattern(NotificationEventType.COMMUNITY_NEW_MEMBER)
  async sendCommunityNewMemberNotification(
    // todo is auto validation possible
    @Payload() eventPayload: CommunityNewMemberPayload,
    @Ctx() context: RmqContext
  ) {
    this.sendNotifications(
      eventPayload,
      context,
      this.notificationService.sendCommunityNewMemberNotifications(
        eventPayload
      ),
      NotificationEventType.COMMUNITY_NEW_MEMBER
    );
  }

  @EventPattern(NotificationEventType.COLLABORATION_INTEREST)
  async sendCommunityCollaborationInterestNotification(
    @Payload() eventPayload: CollaborationInterestPayload,
    @Ctx() context: RmqContext
  ) {
    this.sendNotifications(
      eventPayload,
      context,
      this.notificationService.sendCommunityCollaborationInterestNotification(
        eventPayload
      ),
      NotificationEventType.COLLABORATION_INTEREST
    );
  }

  @EventPattern(NotificationEventType.PLATFORM_USER_REGISTERED)
  async sendUserRegisteredNotification(
    // todo is auto validation possible
    @Payload() eventPayload: PlatformUserRegistrationEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.sendNotifications(
      eventPayload,
      context,
      this.notificationService.sendUserRegisteredNotification(eventPayload),
      NotificationEventType.PLATFORM_USER_REGISTERED
    );
  }

  @EventPattern(NotificationEventType.PLATFORM_USER_REMOVED)
  async sendUserRemovedNotification(
    // todo is auto validation possible
    @Payload() eventPayload: PlatformUserRemovedEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.sendNotifications(
      eventPayload,
      context,
      this.notificationService.sendUserRemovedNotification(eventPayload),
      NotificationEventType.PLATFORM_USER_REMOVED
    );
  }

  @EventPattern(NotificationEventType.COMMUNICATION_UPDATE_SENT)
  async sendCommunicationUpdatedNotifications(
    // todo is auto validation possible
    @Payload() eventPayload: CommunicationUpdateEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.sendNotifications(
      eventPayload,
      context,
      this.notificationService.sendCommunicationUpdatedNotification(
        eventPayload
      ),
      NotificationEventType.COMMUNICATION_UPDATE_SENT
    );
  }

  @EventPattern(NotificationEventType.PLATFORM_FORUM_DISCUSSION_CREATED)
  async sendPlatformForumDiscussionCreatedNotifications(
    // todo is auto validation possible
    @Payload() eventPayload: PlatformForumDiscussionCreatedEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.sendNotifications(
      eventPayload,
      context,
      this.notificationService.sendPlatformForumDiscussionCreatedNotification(
        eventPayload
      ),
      NotificationEventType.PLATFORM_FORUM_DISCUSSION_CREATED
    );
  }

  @EventPattern(NotificationEventType.PLATFORM_FORUM_DISCUSSION_COMMENT)
  async sendPlatformForumDiscussionCommentNotifications(
    @Payload() eventPayload: PlatformForumDiscussionCommentEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.sendNotifications(
      eventPayload,
      context,
      this.notificationService.sendPlatformForumDiscussionCommentNotification(
        eventPayload
      ),
      NotificationEventType.PLATFORM_FORUM_DISCUSSION_COMMENT
    );
  }

  @EventPattern(NotificationEventType.COMMUNICATION_USER_MESSAGE)
  async sendCommunicationUserMessageNotifications(
    @Payload() eventPayload: CommunicationUserMessageEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.sendNotifications(
      eventPayload,
      context,
      this.notificationService.sendCommunicationUserMessageNotification(
        eventPayload
      ),
      NotificationEventType.COMMUNICATION_USER_MESSAGE
    );
  }

  @EventPattern(NotificationEventType.COMMUNICATION_ORGANIZATION_MESSAGE)
  async sendCommunicationOrganizationMessageNotifications(
    @Payload() eventPayload: CommunicationOrganizationMessageEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.sendNotifications(
      eventPayload,
      context,
      this.notificationService.sendCommunicationOrganizationMessageNotification(
        eventPayload
      ),
      NotificationEventType.COMMUNICATION_ORGANIZATION_MESSAGE
    );
  }

  @EventPattern(NotificationEventType.COMMUNICATION_COMMUNITY_MESSAGE)
  async sendCommunicationCommunityLeadsMessageNotifications(
    @Payload() eventPayload: CommunicationCommunityLeadsMessageEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.sendNotifications(
      eventPayload,
      context,
      this.notificationService.sendCommunicationCommunityLeadsMessageNotification(
        eventPayload
      ),
      NotificationEventType.COMMUNICATION_COMMUNITY_MESSAGE
    );
  }

  @EventPattern(NotificationEventType.COMMUNICATION_USER_MENTION)
  async sendCommunicationUserMentionNotifications(
    @Payload() eventPayload: CommunicationUserMentionEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.sendNotifications(
      eventPayload,
      context,
      this.notificationService.sendCommunicationUserMentionNotification(
        eventPayload
      ),
      NotificationEventType.COMMUNICATION_USER_MENTION
    );
  }

  @EventPattern(NotificationEventType.COMMUNICATION_ORGANIZATION_MENTION)
  async sendCommunicationOrganizationMentionNotifications(
    @Payload() eventPayload: CommunicationOrganizationMentionEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.sendNotifications(
      eventPayload,
      context,
      this.notificationService.sendCommunicationOrganizationMentionNotification(
        eventPayload
      ),
      NotificationEventType.COMMUNICATION_ORGANIZATION_MENTION
    );
  }

  @EventPattern(NotificationEventType.COLLABORATION_CONTEXT_REVIEW_SUBMITTED)
  async sendCommunityContextFeedbackNotifications(
    @Payload() eventPayload: CollaborationContextReviewSubmittedPayload,
    @Ctx() context: RmqContext
  ) {
    this.sendNotifications(
      eventPayload,
      context,
      this.notificationService.sendCommunityContextFeedbackNotification(
        eventPayload
      ),
      NotificationEventType.COLLABORATION_CONTEXT_REVIEW_SUBMITTED
    );
  }

  @EventPattern(
    NotificationEventType.COLLABORATION_WHITEBOARD_CREATED,
    Transport.RMQ
  )
  async sendWhiteboardCreatedNotifications(
    @Payload() eventPayload: CollaborationWhiteboardCreatedEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.sendNotifications(
      eventPayload,
      context,
      this.notificationService.sendWhiteboardCreatedNotification(eventPayload),
      NotificationEventType.COLLABORATION_WHITEBOARD_CREATED
    );
  }

  @EventPattern(NotificationEventType.COLLABORATION_POST_CREATED, Transport.RMQ)
  async sendPostCreatedNotifications(
    @Payload() eventPayload: CollaborationCardCreatedEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.sendNotifications(
      eventPayload,
      context,
      this.notificationService.sendPostCreatedNotification(eventPayload),
      NotificationEventType.COLLABORATION_POST_CREATED
    );
  }

  @EventPattern(NotificationEventType.COLLABORATION_POST_COMMENT, Transport.RMQ)
  async sendPostCommentCreatedNotifications(
    @Payload() eventPayload: CollaborationCardCommentEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.sendNotifications(
      eventPayload,
      context,
      this.notificationService.sendPostCommentCreatedNotification(eventPayload),
      NotificationEventType.COLLABORATION_POST_COMMENT
    );
  }

  @EventPattern(
    NotificationEventType.COLLABORATION_DISCUSSION_COMMENT,
    Transport.RMQ
  )
  async sendDiscussionCommentCreatedNotifications(
    @Payload() eventPayload: CollaborationDiscussionCommentEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.sendNotifications(
      eventPayload,
      context,
      this.notificationService.sendDiscussionCommentCreatedNotification(
        eventPayload
      ),
      NotificationEventType.COLLABORATION_DISCUSSION_COMMENT
    );
  }

  @EventPattern(
    NotificationEventType.COLLABORATION_CALLOUT_PUBLISHED,
    Transport.RMQ
  )
  async sendCalloutPublishedNotifications(
    @Payload() eventPayload: CollaborationCalloutPublishedEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.sendNotifications(
      eventPayload,
      context,
      this.notificationService.sendCalloutPublishedNotification(eventPayload),
      NotificationEventType.COLLABORATION_CALLOUT_PUBLISHED
    );
  }

  private async sendNotifications(
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
