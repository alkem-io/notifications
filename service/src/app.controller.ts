import { Controller, Inject, LoggerService } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  Payload,
  RmqContext,
  Transport,
} from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  NotificationEventPayloadPlatformUserRemoved,
  NotificationEventPayloadPlatformForumDiscussion,
  NotificationEventPayloadPlatformGlobalRole,
  NotificationEventPayloadPlatformUserRegistration,
  NotificationEventPayloadPlatformSpaceCreated,
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
import { NotificationEvent } from './generated/alkemio-schema';

@Controller()
export class AppController {
  constructor(
    private notificationService: NotificationService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService
  ) {}

  // todo is auto validation of payloads possible/

  @EventPattern(NotificationEvent.SpaceAdminCommunityApplication)
  async sendSpaceCommunityApplicationAdminNotification(
    @Payload() eventPayload: NotificationEventPayloadSpaceCommunityApplication,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(NotificationEvent.UserSpaceCommunityInvitation)
  async sendSpaceCommunityInvitationNotification(
    @Payload() eventPayload: NotificationEventPayloadSpaceCommunityInvitation,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(NotificationEvent.UserSpaceCommunityApplicationDeclined)
  async sendSpaceCommunityApplicationDeclinedNotification(
    @Payload() eventPayload: NotificationEventPayloadSpaceCommunityApplication,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
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
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(NotificationEvent.SpaceCommunityInvitationUserPlatform)
  async sendCommunityPlatformInvitationNotification(
    @Payload()
    eventPayload: NotificationEventPayloadSpaceCommunityInvitationPlatform,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(NotificationEvent.UserSpaceCommunityJoined)
  async sendCommunityNewMemberNotification(
    @Payload() eventPayload: NotificationEventPayloadSpaceCommunityContributor,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(NotificationEvent.SpaceAdminCommunityNewMember)
  async sendCommunityNewMemberAdminNotification(
    @Payload() eventPayload: NotificationEventPayloadSpaceCommunityContributor,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(NotificationEvent.PlatformAdminGlobalRoleChanged)
  async sendPlatformGlobalRoleChangeNotification(
    @Payload() eventPayload: NotificationEventPayloadPlatformGlobalRole,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(NotificationEvent.UserSignUpWelcome)
  async sendUserSignUpWelcomeNotification(
    @Payload() eventPayload: NotificationEventPayloadPlatformUserRegistration,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(NotificationEvent.PlatformAdminUserProfileCreated)
  async sendPlatformUserRegisteredAdminNotification(
    @Payload() eventPayload: NotificationEventPayloadPlatformUserRegistration,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(NotificationEvent.PlatformAdminUserProfileRemoved)
  async sendUserRemovedNotification(
    @Payload() eventPayload: NotificationEventPayloadPlatformUserRemoved,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(NotificationEvent.SpaceCommunicationUpdate)
  async sendSpaceCommunicationUpdateNotifications(
    @Payload()
    eventPayload: NotificationEventPayloadSpaceCommunicationUpdate,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(NotificationEvent.PlatformForumDiscussionCreated)
  async sendPlatformForumDiscussionCreatedNotifications(
    @Payload() eventPayload: NotificationEventPayloadPlatformForumDiscussion,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(NotificationEvent.PlatformForumDiscussionComment)
  async sendPlatformForumDiscussionCommentNotifications(
    @Payload() eventPayload: NotificationEventPayloadPlatformForumDiscussion,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(NotificationEvent.UserMessage)
  async sendUserMessageNotifications(
    @Payload() eventPayload: NotificationEventPayloadUserMessageDirect,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(NotificationEvent.UserMessageSender)
  async sendUserMessageSenderNotifications(
    @Payload() eventPayload: NotificationEventPayloadUserMessageDirect,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(NotificationEvent.OrganizationAdminMessage)
  async sendOrganizationMessageRecipientNotifications(
    @Payload() eventPayload: NotificationEventPayloadOrganizationMessageDirect,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(NotificationEvent.OrganizationMessageSender)
  async sendOrganizationMessageSenderNotifications(
    @Payload() eventPayload: NotificationEventPayloadOrganizationMessageDirect,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(NotificationEvent.SpaceLeadCommunicationMessage)
  async sendSpaceCommunicationMessageRecipientNotifications(
    @Payload()
    eventPayload: NotificationEventPayloadSpaceCommunicationMessageDirect,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(NotificationEvent.UserMentioned)
  async sendUserMentionNotifications(
    @Payload() eventPayload: NotificationEventPayloadUserMessageRoom,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(NotificationEvent.OrganizationAdminMentioned)
  async sendOrganizationMentionNotifications(
    @Payload() eventPayload: NotificationEventPayloadOrganizationMessageRoom,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
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
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(
    NotificationEvent.SpaceCollaborationCalloutContribution,
    Transport.RMQ
  )
  async sendSpaceCollaborationCalloutContributionNotifications(
    @Payload() eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(
    NotificationEvent.SpaceAdminCollaborationCalloutContribution,
    Transport.RMQ
  )
  async sendSpaceAdminCollaborationCalloutContributionNotifications(
    @Payload() eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
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
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
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
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(NotificationEvent.UserCommentReply, Transport.RMQ)
  async sendUserCommentReplyNotifications(
    @Payload() eventPayload: NotificationEventPayloadUserMessageRoomReply,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(NotificationEvent.PlatformAdminSpaceCreated)
  async sendPlatformSpaceCreatedNotifications(
    @Payload()
    eventPayload: NotificationEventPayloadPlatformSpaceCreated,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }
}
