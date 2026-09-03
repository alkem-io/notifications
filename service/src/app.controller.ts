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
  NotificationEventPayloadSpaceCalendarEvent,
  NotificationEventPayloadSpacePollVoteCastOnOwnPoll,
  NotificationEventPayloadSpacePollVoteCastOnPollIVotedOn,
  NotificationEventPayloadSpacePollModifiedOnPollIVotedOn,
  NotificationEventPayloadSpacePollVoteAffectedByOptionChange,
  NotificationEventPayloadUserEmailChangeSecuritySignal,
  NotificationEventPayloadUserPasswordChangeSecuritySignal,
  NotificationEventPayloadUserEmailChangeNewAddress,
  NotificationEventPayloadUserEmailChangeGlobalAdmin,
  NotificationEventPayloadUserEmailChangeSpaceAdmin,
  NotificationEventPayloadUserConversationMessageDirect,
  NotificationEventPayloadUserConversationMessageGroup,
  NotificationEventPayloadSpaceCollaborationCalloutReaction,
} from '@alkemio/notifications-lib';
import { NotificationEventPayloadSpaceCommunityInvitationOrganization } from './types/notifications.lib.organization.invitation.bridge';
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

  @EventPattern(NotificationEvent.VirtualAdminSpaceCommunityInvitation)
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

  @EventPattern(NotificationEvent.SpaceAdminVirtualCommunityInvitationDeclined)
  async sendSpaceCommunityVirtualContributorInvitationDeclinedNotifications(
    @Payload()
    eventPayload: NotificationEventPayloadSpaceCommunityInvitationVirtualContributor,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(NotificationEvent.OrganizationAdminSpaceCommunityInvitation)
  async sendOrganizationSpaceCommunityInvitationNotifications(
    @Payload()
    eventPayload: NotificationEventPayloadSpaceCommunityInvitationOrganization,
    @Ctx() context: RmqContext
  ) {
    // A zero-admin organization has no in-platform recipient, so the server
    // sends an empty recipients list plus a raw support-team address —
    // normalize that into a single synthetic recipient before the standard
    // pipeline runs, exactly like the other raw-email escalation paths.
    const normalized =
      this.notificationService.applySupportRecipientIfNoRecipients(
        eventPayload
      );
    return this.notificationService.processNotificationEvent(
      normalized,
      context
    );
  }

  @EventPattern(
    NotificationEvent.SpaceAdminOrganizationCommunityInvitationAccepted
  )
  async sendSpaceCommunityOrganizationInvitationAcceptedNotifications(
    @Payload()
    eventPayload: NotificationEventPayloadSpaceCommunityInvitation,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(
    NotificationEvent.SpaceAdminOrganizationCommunityInvitationDeclined
  )
  async sendSpaceCommunityOrganizationInvitationDeclinedNotifications(
    @Payload()
    eventPayload: NotificationEventPayloadSpaceCommunityInvitation,
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

  @EventPattern(NotificationEvent.SpaceCommunityCalendarEventCreated)
  async sendSpaceCommunityCalendarEventCreatedNotification(
    @Payload() eventPayload: NotificationEventPayloadSpaceCalendarEvent,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(NotificationEvent.SpaceCommunityCalendarEventComment)
  async sendSpaceCommunityCalendarEventCommentNotification(
    @Payload() eventPayload: NotificationEventPayloadSpaceCalendarEvent,
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

  // NotificationEvent.UserMessageSender was removed from the server schema
  // (schema drift unrelated to 034 — the server no longer emits this event;
  // USER_MESSAGE_DIRECT/GROUP or the conversation-message events below cover
  // the sender-facing flows now). The @EventPattern registration and switch
  // cases were dropped in lockstep with the codegen refresh.

  // 034-messaging-notifications (contract C-2): two full wire events (Ruling
  // R1) — one handler each, never routed through the leaking USER_MESSAGE
  // event/template.
  @EventPattern(NotificationEvent.UserConversationMessageDirect)
  async sendUserConversationMessageDirectNotifications(
    @Payload()
    eventPayload: NotificationEventPayloadUserConversationMessageDirect,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(NotificationEvent.UserConversationMessageGroup)
  async sendUserConversationMessageGroupNotifications(
    @Payload()
    eventPayload: NotificationEventPayloadUserConversationMessageGroup,
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

  @EventPattern(
    NotificationEvent.SpaceCollaborationCalloutReaction,
    Transport.RMQ
  )
  async sendSpaceCollaborationCalloutReactionNotifications(
    @Payload()
    eventPayload: NotificationEventPayloadSpaceCollaborationCalloutReaction,
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

  @EventPattern(NotificationEvent.SpaceCollaborationPollVoteCastOnOwnPoll)
  async sendSpacePollVoteCastOnOwnPollNotifications(
    @Payload()
    eventPayload: NotificationEventPayloadSpacePollVoteCastOnOwnPoll,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(NotificationEvent.SpaceCollaborationPollVoteCastOnPollIVotedOn)
  async sendSpacePollVoteCastOnPollIVotedOnNotifications(
    @Payload()
    eventPayload: NotificationEventPayloadSpacePollVoteCastOnPollIVotedOn,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(NotificationEvent.SpaceCollaborationPollModifiedOnPollIVotedOn)
  async sendSpacePollModifiedOnPollIVotedOnNotifications(
    @Payload()
    eventPayload: NotificationEventPayloadSpacePollModifiedOnPollIVotedOn,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(
    NotificationEvent.SpaceCollaborationPollVoteAffectedByOptionChange
  )
  async sendSpacePollVoteAffectedByOptionChangeNotifications(
    @Payload()
    eventPayload: NotificationEventPayloadSpacePollVoteAffectedByOptionChange,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(NotificationEvent.UserEmailChangeSecuritySignal)
  async sendUserEmailChangeSecuritySignalNotification(
    @Payload()
    eventPayload: NotificationEventPayloadUserEmailChangeSecuritySignal,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      this.notificationService.normalizeRawRecipientEmailEvent(
        eventPayload,
        NotificationEvent.UserEmailChangeSecuritySignal
      ),
      context
    );
  }

  @EventPattern(NotificationEvent.UserEmailChangeNewAddressNotification)
  async sendUserEmailChangeNewAddressNotification(
    @Payload()
    eventPayload: NotificationEventPayloadUserEmailChangeNewAddress,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      this.notificationService.normalizeRawRecipientEmailEvent(
        eventPayload,
        NotificationEvent.UserEmailChangeNewAddressNotification
      ),
      context
    );
  }

  @EventPattern(NotificationEvent.UserEmailChangeGlobalAdminNotification)
  async sendUserEmailChangeGlobalAdminNotification(
    @Payload()
    eventPayload: NotificationEventPayloadUserEmailChangeGlobalAdmin,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(NotificationEvent.UserEmailChangeSpaceAdminNotification)
  async sendUserEmailChangeSpaceAdminNotification(
    @Payload()
    eventPayload: NotificationEventPayloadUserEmailChangeSpaceAdmin,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      eventPayload,
      context
    );
  }

  @EventPattern(NotificationEvent.UserPasswordChangeSecuritySignal)
  async sendUserPasswordChangeSecuritySignalNotification(
    @Payload()
    eventPayload: NotificationEventPayloadUserPasswordChangeSecuritySignal,
    @Ctx() context: RmqContext
  ) {
    return this.notificationService.processNotificationEvent(
      this.notificationService.normalizeRawRecipientEmailEvent(
        eventPayload,
        NotificationEvent.UserPasswordChangeSecuritySignal
      ),
      context
    );
  }
}
