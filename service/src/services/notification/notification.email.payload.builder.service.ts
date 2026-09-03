import { Injectable } from '@nestjs/common';
import { PlatformUser, User } from '@core/models';
import { convertMarkdownToText } from '@src/services/notification/utils/markdown-to-text.util';
import { convertMarkdownToHtml } from '@src/services/notification/utils/markdown-to-html.util';
import {
  CommunityApplicationCreatedEmailPayload,
  CommunityApplicationDeclinedEmailPayload,
  CommunityInvitationCreatedEmailPayload,
  CommunityNewMemberEmailPayload,
  CommunicationUpdateCreatedEmailPayload,
  CommunicationUserMessageEmailPayload,
  UserConversationMessageDirectEmailPayload,
  UserConversationMessageGroupEmailPayload,
  CommunicationOrganizationMessageEmailPayload,
  CommunicationOrganizationMentionEmailPayload,
  CommunicationUserMentionEmailPayload,
  SpaceCommunicationMessageDirectEmailPayload,
  CollaborationPostCreatedEmailPayload,
  SpaceCollaborationCalloutCommentEmailPayload,
  CollaborationPostCommentEmailPayload,
  CollaborationCalloutPublishedEmailPayload,
  SpaceCollaborationCalloutReactionEmailPayload,
  CommentReplyEmailPayload,
  PlatformUserRegisteredEmailPayload,
  PlatformForumDiscussionCreatedEmailPayload,
  PlatformForumDiscussionCommentEmailPayload,
  SpaceCreatedEmailPayload,
  SpaceCommunityInvitationPlatformCreatedEmailPayload,
  CommunityInvitationVirtualContributorCreatedEmailPayload,
  CommunityInvitationVirtualContributorDeclinedEmailPayload,
  SpaceCommunityCalendarEventCreatedEmailPayload,
  SpaceCommunityCalendarEventCommentEmailPayload,
  PlatformGlobalRoleChangeEmailPayload,
  PlatformUserRemovedEmailPayload,
  BaseEmailPayload,
  BaseSpaceEmailPayload,
  PollVoteCastEmailPayload,
  PollModifiedEmailPayload,
  UserEmailChangeSecuritySignalEmailPayload,
  UserEmailChangeNewAddressEmailPayload,
  PlatformAdminUserEmailChangeEmailPayload,
  SpaceAdminUserEmailChangeEmailPayload,
  UserPasswordChangeSecuritySignalEmailPayload,
  OrganizationSpaceCommunityInvitationCreatedEmailPayload,
  OrganizationSpaceCommunityInvitationAcceptedEmailPayload,
  OrganizationSpaceCommunityInvitationDeclinedEmailPayload,
} from '@src/services/notification/email-template-payload';
import {
  NotificationEventPayloadSpaceCommunityApplication,
  NotificationEventPayloadSpaceCommunityInvitation,
  NotificationEventPayloadSpaceCommunityContributor,
  NotificationEventPayloadPlatformGlobalRole,
  NotificationEventPayloadPlatformUserRegistration,
  NotificationEventPayloadPlatformUserRemoved,
  NotificationEventPayloadPlatformForumDiscussion,
  NotificationEventPayloadSpaceCommunicationUpdate,
  NotificationEventPayloadUserMessageDirect,
  NotificationEventPayloadOrganizationMessageDirect,
  NotificationEventPayloadOrganizationMessageRoom,
  NotificationEventPayloadSpaceCommunicationMessageDirect,
  NotificationEventPayloadSpaceCollaborationCallout,
  NotificationEventPayloadUserMessageRoomReply,
  NotificationEventPayloadUserMessageRoom,
  NotificationEventPayloadPlatformSpaceCreated,
  NotificationEventPayloadSpaceCommunityInvitationPlatform,
  NotificationEventPayloadSpaceCommunityInvitationVirtualContributor,
  NotificationEventPayloadSpaceCalendarEvent,
  NotificationEventPayloadSpacePollVoteCastOnOwnPoll,
  NotificationEventPayloadSpacePollVoteCastOnPollIVotedOn,
  NotificationEventPayloadSpacePollModifiedOnPollIVotedOn,
  NotificationEventPayloadSpacePollVoteAffectedByOptionChange,
  BaseEventPayload,
  NotificationEventPayloadSpace,
  NotificationEventPayloadUserEmailChangeSecuritySignal,
  NotificationEventPayloadUserEmailChangeNewAddress,
  NotificationEventPayloadUserEmailChangeGlobalAdmin,
  NotificationEventPayloadUserEmailChangeSpaceAdmin,
  NotificationEventPayloadUserPasswordChangeSecuritySignal,
  ConversationDigestEntry,
  NotificationEventPayloadUserConversationMessageDirect,
  NotificationEventPayloadUserConversationMessageGroup,
  NotificationEventPayloadSpaceCollaborationCalloutReaction,
} from '@alkemio/notifications-lib';
import { NotificationEventPayloadSpaceCommunityInvitationOrganization } from '@src/types/notifications.lib.organization.invitation.bridge';
import { ConfigurationTypes } from '@src/common/enums/configuration.type';
import { ConfigService } from '@nestjs/config';
import { EventPayloadNotProvidedException } from '@src/common/exceptions/event.payload.not.provided.exception';
import { LogContext } from '@src/common/enums';
// NotificationEvent-adjacent `RoleSetContributorType` (previously imported
// from the generated schema) was removed from the schema entirely as part
// of the wave-1 Actor/Account refactor, with no like-for-like replacement —
// `ActorType.VirtualContributor` serializes to 'VIRTUAL_CONTRIBUTOR', not
// the 'VIRTUAL' wire value this comparison has always been written against
// (see notification.email.payload.builder.community.spec.ts). Hardcoding the
// literal here reconciles the compile-time break from schema drift without
// changing this pre-existing (pre-034) comparison's behavior.
const VIRTUAL_CONTRIBUTOR_TYPE = 'VIRTUAL';

@Injectable()
export class NotificationEmailPayloadBuilderService {
  invitationsPath: string;
  constructor(private readonly configService: ConfigService) {
    this.invitationsPath = this.configService.get(
      ConfigurationTypes.ALKEMIO
    )?.webclient_invitations_path;
  }

  public createEmailTemplatePayloadSpaceCommunityApplication(
    eventPayload: NotificationEventPayloadSpaceCommunityApplication,
    recipient: User
  ): CommunityApplicationCreatedEmailPayload {
    return {
      ...this.createSpaceBaseEmailPayload(eventPayload, recipient),
      applicant: {
        firstName: eventPayload.triggeredBy.firstName,
        name: eventPayload.triggeredBy.profile.displayName,
        email: eventPayload.triggeredBy.email,
        profile: eventPayload.triggeredBy.profile.url,
      },
      spaceAdminURL: eventPayload.space.adminURL,
    };
  }

  public createEmailTemplatePayloadSpaceAdminCommunityApplication(
    eventPayload: NotificationEventPayloadSpaceCommunityApplication,
    recipient: User
  ): CommunityApplicationCreatedEmailPayload {
    return {
      ...this.createSpaceBaseEmailPayload(eventPayload, recipient),
      applicant: {
        firstName: eventPayload.triggeredBy.firstName,
        name: eventPayload.triggeredBy.profile.displayName,
        email: eventPayload.triggeredBy.email,
        profile: eventPayload.triggeredBy.profile.url,
      },
      spaceAdminURL: eventPayload.space.adminURL,
    };
  }

  public createEmailTemplatePayloadUserSpaceCommunityInvitation(
    eventPayload: NotificationEventPayloadSpaceCommunityInvitation,
    recipient: User
  ): CommunityInvitationCreatedEmailPayload {
    const invitationsURL = `${eventPayload.platform.url.replace(/\/+$/, '')}${
      this.invitationsPath
    }`;

    return {
      ...this.createSpaceBaseEmailPayload(eventPayload, recipient),
      inviter: {
        firstName: eventPayload.triggeredBy.firstName,
        name: eventPayload.triggeredBy.profile.displayName,
        email: eventPayload.triggeredBy.email,
        profile: eventPayload.triggeredBy.profile.url,
      },
      spaceAdminURL: eventPayload.space.adminURL,
      welcomeMessage: eventPayload.welcomeMessage,
      invitationsURL,
    };
  }

  public createEmailTemplatePayloadUserSpaceCommunityApplicationDeclined(
    eventPayload: NotificationEventPayloadSpaceCommunityApplication,
    recipient: User
  ): CommunityApplicationDeclinedEmailPayload {
    return {
      ...this.createSpaceBaseEmailPayload(eventPayload, recipient),
      decliner: {
        firstName: eventPayload.triggeredBy.firstName,
        name: eventPayload.triggeredBy.profile.displayName,
        email: eventPayload.triggeredBy.email,
        profile: eventPayload.triggeredBy.profile.url,
      },
      spaceURL: eventPayload.space.profile.url,
    };
  }

  public createEmailTemplatePayloadVirtualContributorInvitation(
    eventPayload: NotificationEventPayloadSpaceCommunityInvitationVirtualContributor,
    recipient: User
  ): CommunityInvitationVirtualContributorCreatedEmailPayload {
    return {
      ...this.createSpaceBaseEmailPayload(eventPayload, recipient),
      inviter: {
        firstName: eventPayload.triggeredBy.firstName,
        name: eventPayload.triggeredBy.profile.displayName,
        email: eventPayload.triggeredBy.email,
        profile: eventPayload.triggeredBy.profile.url,
      },
      spaceAdminURL: eventPayload.space.adminURL,
      welcomeMessage: eventPayload.welcomeMessage,
      virtualContributor: {
        name: eventPayload.invitee.profile.displayName,
        url: eventPayload.invitee.profile.url,
      },
    };
  }

  public createEmailTemplatePayloadVirtualContributorInvitationDeclined(
    eventPayload: NotificationEventPayloadSpaceCommunityInvitationVirtualContributor,
    recipient: User
  ): CommunityInvitationVirtualContributorDeclinedEmailPayload {
    return {
      ...this.createSpaceBaseEmailPayload(eventPayload, recipient),
      decliner: {
        firstName: eventPayload.triggeredBy.firstName,
        name: eventPayload.triggeredBy.profile.displayName,
        email: eventPayload.triggeredBy.email,
        profile: eventPayload.triggeredBy.profile.url,
      },
      virtualContributor: {
        name: eventPayload.host.profile.displayName,
        url: eventPayload.host.profile.url,
      },
      spaceURL: eventPayload.space.profile.url,
    };
  }

  public createEmailTemplatePayloadOrganizationSpaceCommunityInvitation(
    eventPayload: NotificationEventPayloadSpaceCommunityInvitationOrganization,
    recipient: User
  ): OrganizationSpaceCommunityInvitationCreatedEmailPayload {
    return {
      ...this.createSpaceBaseEmailPayload(eventPayload, recipient),
      inviter: {
        firstName: eventPayload.triggeredBy.firstName,
        name: eventPayload.triggeredBy.profile.displayName,
        email: eventPayload.triggeredBy.email,
        profile: eventPayload.triggeredBy.profile.url,
      },
      organization: {
        name: eventPayload.invitee.profile.displayName,
        url: eventPayload.invitee.profile.url,
      },
      offeredRole: eventPayload.extraRoles.includes('LEAD')
        ? 'Member + Lead'
        : 'Member',
      spacesToJoin: eventPayload.spacesToJoin,
      welcomeMessage: eventPayload.welcomeMessage,
      organizationInvitationsUrl: eventPayload.organizationInvitationsUrl,
    };
  }

  public createEmailTemplatePayloadOrganizationSpaceCommunityInvitationAccepted(
    eventPayload: NotificationEventPayloadSpaceCommunityInvitation,
    recipient: User
  ): OrganizationSpaceCommunityInvitationAcceptedEmailPayload {
    return {
      ...this.createSpaceBaseEmailPayload(eventPayload, recipient),
      actor: {
        firstName: eventPayload.triggeredBy.firstName,
        name: eventPayload.triggeredBy.profile.displayName,
        profile: eventPayload.triggeredBy.profile.url,
      },
      organization: {
        name: eventPayload.invitee.profile.displayName,
        url: eventPayload.invitee.profile.url,
      },
      spaceCommunitySettingsURL: `${eventPayload.space.adminURL}/community`,
    };
  }

  public createEmailTemplatePayloadOrganizationSpaceCommunityInvitationDeclined(
    eventPayload: NotificationEventPayloadSpaceCommunityInvitation,
    recipient: User
  ): OrganizationSpaceCommunityInvitationDeclinedEmailPayload {
    return {
      ...this.createSpaceBaseEmailPayload(eventPayload, recipient),
      actor: {
        firstName: eventPayload.triggeredBy.firstName,
        name: eventPayload.triggeredBy.profile.displayName,
        profile: eventPayload.triggeredBy.profile.url,
      },
      organization: {
        name: eventPayload.invitee.profile.displayName,
        url: eventPayload.invitee.profile.url,
      },
      spaceCommunitySettingsURL: `${eventPayload.space.adminURL}/community`,
    };
  }

  public createEmailTemplatePayloadSpaceCommunityInvitationPlatform(
    eventPayload: NotificationEventPayloadSpaceCommunityInvitationPlatform,
    recipient: User
  ): SpaceCommunityInvitationPlatformCreatedEmailPayload {
    const invitationsURL = `${eventPayload.platform.url.replace(/\/+$/, '')}${
      this.invitationsPath
    }`;

    return {
      ...this.createSpaceBaseEmailPayload(eventPayload, recipient),
      inviter: {
        firstName: eventPayload.triggeredBy.firstName,
        name: eventPayload.triggeredBy.profile.displayName,
        email: eventPayload.triggeredBy.email,
        profile: eventPayload.triggeredBy.profile.url,
      },
      spaceAdminURL: eventPayload.space.adminURL,
      emails: recipient.email,
      welcomeMessage: eventPayload.welcomeMessage,
      invitationsURL,
    };
  }

  public createEmailTemplatePayloadUserSpaceCommunityJoined(
    eventPayload: NotificationEventPayloadSpaceCommunityContributor,
    recipient: User
  ): CommunityNewMemberEmailPayload {
    const newMember = eventPayload.contributor;
    const typeName =
      newMember.type.toLowerCase() === VIRTUAL_CONTRIBUTOR_TYPE.toLowerCase()
        ? 'Virtual Contributor'
        : newMember.type;

    return {
      ...this.createSpaceBaseEmailPayload(eventPayload, recipient),
      member: {
        name: newMember.profile.displayName,
        profile: newMember.profile.url,
        type: typeName,
      },
    };
  }

  public createEmailTemplatePayloadSpaceAdminCommunityNewMember(
    eventPayload: NotificationEventPayloadSpaceCommunityContributor,
    recipient: User
  ): CommunityNewMemberEmailPayload {
    const newMember = eventPayload.contributor;
    const typeName =
      newMember.type.toLowerCase() === VIRTUAL_CONTRIBUTOR_TYPE.toLowerCase()
        ? 'Virtual Contributor'
        : newMember.type;

    return {
      ...this.createSpaceBaseEmailPayload(eventPayload, recipient),
      member: {
        name: newMember.profile.displayName,
        profile: newMember.profile.url,
        type: typeName,
      },
    };
  }

  public createEmailTemplatePayloadSpaceCommunityCalendarEventCreated(
    eventPayload: NotificationEventPayloadSpaceCalendarEvent,
    recipient: User
  ): SpaceCommunityCalendarEventCreatedEmailPayload {
    const dateFormatOptions: Intl.DateTimeFormatOptions = {
      timeZone: 'Europe/Amsterdam',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...(eventPayload.calendarEvent.wholeDay
        ? {}
        : { hour: 'numeric', minute: '2-digit' }),
    };

    const startDate = new Date(eventPayload.calendarEvent.startDate);
    const endDate = new Date(eventPayload.calendarEvent.endDate);

    const formattedStartDate = `${startDate.toLocaleString(
      'en-GB',
      dateFormatOptions
    )} (CET)`;
    const formattedEndDate =
      startDate.getTime() === endDate.getTime()
        ? null
        : `${endDate.toLocaleString('en-GB', dateFormatOptions)} (CET)`;
    return {
      ...this.createSpaceBaseEmailPayload(eventPayload, recipient),
      creator: {
        name: eventPayload.triggeredBy.profile.displayName,
        profile: eventPayload.triggeredBy.profile.url,
      },
      calendarEvent: {
        title: eventPayload.calendarEvent.title,
        description: eventPayload.calendarEvent.description,
        location: eventPayload.calendarEvent.location,
        startDate: eventPayload.calendarEvent.startDate,
        endDate: eventPayload.calendarEvent.endDate,
        wholeDay: eventPayload.calendarEvent.wholeDay,
        formattedStartDate,
        formattedEndDate,
        type: eventPayload.calendarEvent.type,
        url: eventPayload.calendarEvent.url,
        icsDownloadUrl: eventPayload.calendarEvent.icsDownloadUrl,
        googleCalendarUrl: eventPayload.calendarEvent.googleCalendarUrl,
        outlookCalendarUrl: eventPayload.calendarEvent.outlookCalendarUrl,
      },
    };
  }

  public createEmailTemplatePayloadSpaceCommunityCalendarEventComment(
    eventPayload: NotificationEventPayloadSpaceCalendarEvent,
    recipient: User
  ): SpaceCommunityCalendarEventCommentEmailPayload {
    return {
      ...this.createSpaceBaseEmailPayload(eventPayload, recipient),
      commentor: {
        name: eventPayload.triggeredBy.profile.displayName,
        profile: eventPayload.triggeredBy.profile.url,
      },
      calendarEvent: {
        title: eventPayload.calendarEvent.title,
        type: eventPayload.calendarEvent.type,
        url: eventPayload.calendarEvent.url,
      },
    };
  }

  // Placeholder methods for the remaining notification types - these need to be implemented
  public createEmailTemplatePayloadPlatformGlobalRoleChange(
    eventPayload: NotificationEventPayloadPlatformGlobalRole,
    recipient: User
  ): PlatformGlobalRoleChangeEmailPayload {
    return {
      ...this.createBaseEmailPayload(eventPayload, recipient),
      user: {
        displayName: eventPayload.user.profile.displayName,
        firstName: eventPayload.user.firstName,
        email: eventPayload.user.email,
        profile: eventPayload.user.profile.url,
      },
      actor: {
        displayName: eventPayload.triggeredBy.profile.displayName,
        url: eventPayload.triggeredBy.profile.url,
      },
      role: eventPayload.role,
      type: eventPayload.type,
      triggeredBy: eventPayload.triggeredBy.id,
    };
  }

  public createEmailTemplatePayloadUserEmailChangeSecuritySignal(
    eventPayload: NotificationEventPayloadUserEmailChangeSecuritySignal &
      BaseEventPayload,
    recipient: User
  ): UserEmailChangeSecuritySignalEmailPayload {
    return {
      ...this.createBaseEmailPayload(eventPayload, recipient),
      changedAt: this.formatChangeTimestampUTC(
        eventPayload.commitTimestampISO8601
      ),
      initiatorRole: eventPayload.initiatorRole,
      newEmailMasked: eventPayload.newEmailMasked,
    };
  }

  public createEmailTemplatePayloadUserPasswordChangeSecuritySignal(
    eventPayload: NotificationEventPayloadUserPasswordChangeSecuritySignal &
      BaseEventPayload,
    recipient: User
  ): UserPasswordChangeSecuritySignalEmailPayload {
    return {
      ...this.createBaseEmailPayload(eventPayload, recipient),
      changedAt: this.formatChangeTimestampUTC(eventPayload.observedAtISO8601),
    };
  }

  public createEmailTemplatePayloadUserEmailChangeNewAddress(
    eventPayload: NotificationEventPayloadUserEmailChangeNewAddress &
      BaseEventPayload,
    recipient: User
  ): UserEmailChangeNewAddressEmailPayload {
    return {
      ...this.createBaseEmailPayload(eventPayload, recipient),
      changedAt: this.formatChangeTimestampUTC(
        eventPayload.commitTimestampISO8601
      ),
      initiatorRole: eventPayload.initiatorRole,
      newEmailFull: eventPayload.newEmailFull,
      loginUrl: eventPayload.loginUrl,
    };
  }

  public createEmailTemplatePayloadPlatformAdminUserEmailChange(
    eventPayload: NotificationEventPayloadUserEmailChangeGlobalAdmin,
    recipient: User
  ): PlatformAdminUserEmailChangeEmailPayload {
    return {
      ...this.createBaseEmailPayload(eventPayload, recipient),
      subjectName: eventPayload.subjectProfileSummary.displayName,
      // Self-initiated changes omit initiatorProfileSummary — fall back to the
      // subject's own profile for the initiator display (FR-019).
      initiatorName:
        eventPayload.initiatorProfileSummary?.displayName ??
        eventPayload.subjectProfileSummary.displayName,
      isSelfInitiated: eventPayload.initiatorRole === 'self',
      oldEmail: eventPayload.oldEmail,
      newEmail: eventPayload.newEmail,
      changedAt: this.formatChangeTimestampUTC(
        eventPayload.commitTimestampISO8601
      ),
      triggerOutcome: eventPayload.triggerOutcome,
      approver: eventPayload.approver,
      reason: eventPayload.reason,
    };
  }

  public createEmailTemplatePayloadSpaceAdminUserEmailChange(
    eventPayload: NotificationEventPayloadUserEmailChangeSpaceAdmin,
    recipient: User
  ): SpaceAdminUserEmailChangeEmailPayload {
    return {
      ...this.createSpaceBaseEmailPayload(eventPayload, recipient),
      subjectName: eventPayload.subjectProfileSummary.displayName,
      // Self-initiated changes omit initiatorProfileSummary — fall back to the
      // subject's own profile for the initiator display (FR-006).
      initiatorName:
        eventPayload.initiatorProfileSummary?.displayName ??
        eventPayload.subjectProfileSummary.displayName,
      isSelfInitiated: eventPayload.initiatorRole === 'self',
      oldEmail: eventPayload.oldEmail,
      newEmail: eventPayload.newEmail,
      changedAt: this.formatChangeTimestampUTC(
        eventPayload.commitTimestampISO8601
      ),
    };
  }

  public createEmailTemplatePayloadUserSignUpWelcome(
    eventPayload: NotificationEventPayloadPlatformUserRegistration,
    recipient: User
  ): PlatformUserRegisteredEmailPayload {
    return {
      ...this.createBaseEmailPayload(eventPayload, recipient),
      registrant: {
        displayName: eventPayload.user.profile.displayName,
        firstName: eventPayload.user.firstName,
        email: eventPayload.user.email,
        profile: eventPayload.user.profile.url,
      },
    };
  }

  public createEmailTemplatePayloadPlatformAdminUserProfileCreated(
    eventPayload: NotificationEventPayloadPlatformUserRegistration,
    recipient: User
  ): PlatformUserRegisteredEmailPayload {
    return {
      ...this.createBaseEmailPayload(eventPayload, recipient),
      registrant: {
        displayName: eventPayload.user.profile.displayName,
        firstName: eventPayload.user.firstName,
        email: eventPayload.user.email,
        profile: eventPayload.user.profile.url,
      },
    };
  }

  public createEmailTemplatePayloadPlatformUserRemoved(
    eventPayload: NotificationEventPayloadPlatformUserRemoved,
    recipient: User
  ): PlatformUserRemovedEmailPayload {
    return {
      ...this.createBaseEmailPayload(eventPayload, recipient),
      registrant: {
        displayName: eventPayload.user.displayName,
        email: eventPayload.user.email,
      },
    };
  }
  public createEmailTemplatePayloadPlatformForumDiscussionComment(
    eventPayload: NotificationEventPayloadPlatformForumDiscussion,
    recipient: User
  ): PlatformForumDiscussionCommentEmailPayload {
    const comment = eventPayload.comment;
    if (!comment) {
      throw new EventPayloadNotProvidedException(
        `comment missing in payload: ${eventPayload}`,
        LogContext.NOTIFICATION_BUILDER
      );
    }
    const result: PlatformForumDiscussionCommentEmailPayload = {
      ...this.createBaseEmailPayload(eventPayload, recipient),
      comment: {
        createdBy: comment.createdBy.id,
        message: comment.message,
      },
      discussion: {
        displayName: eventPayload.discussion.displayName,
        createdBy: eventPayload.discussion.createdBy.id,
        url: eventPayload.discussion.url,
      },
    };
    return result;
  }

  public createEmailTemplatePayloadPlatformForumDiscussionCreated(
    eventPayload: NotificationEventPayloadPlatformForumDiscussion,
    recipient: User
  ): PlatformForumDiscussionCreatedEmailPayload {
    return {
      ...this.createBaseEmailPayload(eventPayload, recipient),
      createdBy: {
        firstName: eventPayload.triggeredBy.firstName,
      },
      discussion: {
        displayName: eventPayload.discussion.displayName,
        url: eventPayload.discussion.url,
      },
    };
  }
  public createEmailTemplatePayloadSpaceCommunicationUpdate(
    eventPayload: NotificationEventPayloadSpaceCommunicationUpdate,
    recipient: User
  ): CommunicationUpdateCreatedEmailPayload {
    return {
      ...this.createSpaceBaseEmailPayload(eventPayload, recipient),
      sender: {
        firstName: eventPayload.triggeredBy.firstName,
      },
      message: convertMarkdownToHtml(eventPayload.message ?? ''),
    };
  }
  public createEmailTemplatePayloadUserMessage(
    eventPayload: NotificationEventPayloadUserMessageDirect,
    recipient: User
  ): CommunicationUserMessageEmailPayload {
    return {
      ...this.createBaseEmailPayload(eventPayload, recipient),
      messageSender: {
        displayName: eventPayload.triggeredBy.profile.displayName,
        firstName: eventPayload.triggeredBy.firstName,
        email: eventPayload.triggeredBy.email,
      },
      message: eventPayload.message,
      messageReceiver: {
        displayName: eventPayload.user.profile.displayName,
        firstName: eventPayload.user.firstName,
      },
    };
  }
  public createEmailTemplatePayloadUserMessageSender(
    eventPayload: NotificationEventPayloadUserMessageDirect,
    recipient: User
  ): CommunicationUserMessageEmailPayload {
    return {
      ...this.createBaseEmailPayload(eventPayload, recipient),
      messageReceiver: {
        displayName: eventPayload.user.profile.displayName,
        firstName: eventPayload.user.firstName,
      },
      messageSender: {
        displayName: eventPayload.triggeredBy.profile.displayName,
        firstName: eventPayload.triggeredBy.firstName,
        email: eventPayload.triggeredBy.email,
      },
      message: eventPayload.message,
    };
  }
  // 034-messaging-notifications (contract C-2, FR-008/FR-009/D-15), revised for
  // Operator Ruling R4: both builders deliberately read ONLY the digest entry
  // fields (displayName/count/url) plus totalCount off the wire payload — never
  // `message`, never `triggeredBy` (which on a digest is provenance only), never
  // any email address — so an event payload smuggling extra fields (e.g.
  // `message`) can never reach the template/rendered output (risk R-3/R-7).
  public createEmailTemplatePayloadUserConversationMessageDirect(
    eventPayload: NotificationEventPayloadUserConversationMessageDirect,
    recipient: User
  ): UserConversationMessageDirectEmailPayload {
    const senders = this.mapConversationDigestEntries(eventPayload.senders);

    return {
      ...this.createBaseEmailPayload(eventPayload, recipient),
      senders,
      totalCount: eventPayload.totalCount,
      entryCount: senders.length,
      subjectLine: this.createConversationDigestSubjectLine(
        senders,
        eventPayload.totalCount,
        'direct'
      ),
    };
  }

  public createEmailTemplatePayloadUserConversationMessageGroup(
    eventPayload: NotificationEventPayloadUserConversationMessageGroup,
    recipient: User
  ): UserConversationMessageGroupEmailPayload {
    const conversations = this.mapConversationDigestEntries(
      eventPayload.conversations
    );

    return {
      ...this.createBaseEmailPayload(eventPayload, recipient),
      conversations,
      totalCount: eventPayload.totalCount,
      entryCount: conversations.length,
      subjectLine: this.createConversationDigestSubjectLine(
        conversations,
        eventPayload.totalCount,
        'group'
      ),
    };
  }

  // Field-by-field copy (never a spread) so nothing beyond the three contract
  // fields can ride an entry into the render.
  private mapConversationDigestEntries(
    entries: ConversationDigestEntry[]
  ): ConversationDigestEntry[] {
    return (entries ?? []).map(entry => ({
      displayName: entry.displayName,
      count: entry.count,
      url: entry.url,
    }));
  }

  // 034-messaging-notifications, data-model §9.1 copy matrix. Resolved HERE
  // rather than in the template because the subject/title is re-rendered
  // through the bare non-autoescaping nunjucks Environment in
  // `notification.templates.builder.ts`, which only guarantees `{{ }}`
  // interpolation — plural branching must not depend on it.
  //
  // The single-entry/count-1 direct case reproduces the pre-R4 subject verbatim
  // so the shipped US1-AS2 copy assertion stays meaningful.
  //
  // An empty entry list is a contract violation upstream (a track that finds
  // nothing unread emits nothing at all — FR-018), not a case to render.
  private createConversationDigestSubjectLine(
    entries: ConversationDigestEntry[],
    totalCount: number,
    kind: 'direct' | 'group'
  ): string {
    if (entries.length === 1) {
      const entry = entries[0];
      if (kind === 'direct') {
        return entry.count === 1
          ? `${entry.displayName} sent you a message`
          : `${entry.displayName} sent you ${entry.count} messages`;
      }
      return entry.count === 1
        ? `New message in ${entry.displayName}`
        : `${entry.count} new messages in ${entry.displayName}`;
    }

    return kind === 'direct'
      ? `${totalCount} new messages from ${entries.length} people`
      : `${totalCount} new messages in ${entries.length} conversations`;
  }

  public createEmailTemplatePayloadOrganizationMessage(
    eventPayload: NotificationEventPayloadOrganizationMessageDirect,
    recipient: User
  ): CommunicationOrganizationMessageEmailPayload {
    return {
      ...this.createBaseEmailPayload(eventPayload, recipient),
      messageSender: {
        displayName: eventPayload.triggeredBy.profile.displayName,
        firstName: eventPayload.triggeredBy.firstName,
        email: eventPayload.triggeredBy.email,
      },
      message: eventPayload.message,
      organization: {
        displayName: eventPayload.organization.profile.displayName,
      },
    };
  }
  public createEmailTemplatePayloadOrganizationMessageSender(
    eventPayload: NotificationEventPayloadOrganizationMessageDirect,
    recipient: User
  ): CommunicationOrganizationMessageEmailPayload {
    return {
      ...this.createBaseEmailPayload(eventPayload, recipient),
      messageSender: {
        displayName: eventPayload.triggeredBy.profile.displayName,
        firstName: eventPayload.triggeredBy.firstName,
        email: eventPayload.triggeredBy.email,
      },
      message: eventPayload.message,
      organization: {
        displayName: eventPayload.organization.profile.displayName,
      },
    };
  }
  public createEmailTemplatePayloadOrganizationMention(
    eventPayload: NotificationEventPayloadOrganizationMessageRoom,
    recipient: User
  ): CommunicationOrganizationMentionEmailPayload {
    const htmlComment: string = convertMarkdownToText(eventPayload.comment);

    return {
      ...this.createBaseEmailPayload(eventPayload, recipient),
      commentSender: {
        displayName: eventPayload.triggeredBy.profile.displayName,
        firstName: eventPayload.triggeredBy.firstName,
      },
      comment: htmlComment,
      mentionedOrganization: {
        displayName: eventPayload.organization.profile.displayName,
      },
      commentOrigin: {
        url: eventPayload.commentOrigin.url,
        displayName: eventPayload.commentOrigin.displayName,
      },
    };
  }
  public createEmailTemplatePayloadSpaceCommunicationMessage(
    eventPayload: NotificationEventPayloadSpaceCommunicationMessageDirect,
    recipient: User
  ): SpaceCommunicationMessageDirectEmailPayload {
    return {
      ...this.createSpaceBaseEmailPayload(eventPayload, recipient),
      messageSender: {
        displayName: eventPayload.triggeredBy.profile.displayName,
        firstName: eventPayload.triggeredBy.firstName,
        email: eventPayload.triggeredBy.email,
      },
      message: eventPayload.message,
    };
  }
  public createEmailTemplatePayloadSpaceCollaborationCalloutContribution(
    eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    recipient: User
  ): CollaborationPostCreatedEmailPayload {
    const contribution = eventPayload.callout.contribution;
    if (!contribution) {
      throw new EventPayloadNotProvidedException(
        'Contribution not found',
        LogContext.NOTIFICATION_BUILDER
      );
    }
    return {
      ...this.createSpaceBaseEmailPayload(eventPayload, recipient),
      createdBy: {
        firstName: eventPayload.triggeredBy.firstName,
        email: eventPayload.triggeredBy.email,
      },
      callout: {
        displayName: eventPayload.callout.framing.displayName,
        url: eventPayload.callout.framing.url,
      },
      contribution: {
        displayName: contribution.displayName,
        url: contribution.url,
        type: contribution.type,
      },
    };
  }
  public createEmailTemplatePayloadSpaceAdminCollaborationCalloutContribution(
    eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    recipient: User
  ): CollaborationPostCreatedEmailPayload {
    const contribution = eventPayload.callout.contribution;
    if (!contribution) {
      throw new EventPayloadNotProvidedException(
        'Contribution not found',
        LogContext.NOTIFICATION_BUILDER
      );
    }
    return {
      ...this.createSpaceBaseEmailPayload(eventPayload, recipient),
      createdBy: {
        firstName: eventPayload.triggeredBy.firstName,
        email: eventPayload.triggeredBy.email,
      },
      callout: {
        displayName: eventPayload.callout.framing.displayName,
        url: eventPayload.callout.framing.url,
      },
      contribution: {
        displayName: contribution.displayName,
        url: contribution.url,
        type: contribution.type,
      },
    };
  }
  public createEmailTemplatePayloadSpaceCollaborationCalloutComment(
    eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    recipient: User
  ): SpaceCollaborationCalloutCommentEmailPayload {
    return {
      ...this.createSpaceBaseEmailPayload(eventPayload, recipient),
      createdBy: {
        firstName: eventPayload.triggeredBy.firstName,
        email: eventPayload.triggeredBy.email,
      },
      callout: {
        displayName: eventPayload.callout.framing.displayName,
        url: eventPayload.callout.framing.url,
        type: this.normalizeCalloutType(eventPayload.callout.framing.type),
      },
    };
  }
  public createEmailTemplatePayloadSpaceCollaborationCalloutPostContributionComment(
    eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    recipient: User
  ): CollaborationPostCommentEmailPayload {
    const callout = eventPayload.callout;

    const contribution = eventPayload.callout.contribution;
    if (!contribution) {
      throw new EventPayloadNotProvidedException(
        'Contribution not found',
        LogContext.NOTIFICATION_BUILDER
      );
    }
    return {
      ...this.createSpaceBaseEmailPayload(eventPayload, recipient),
      callout: {
        displayName: callout.framing.displayName,
        url: callout.framing.url,
      },
      post: {
        displayName: contribution.displayName,
        url: contribution.url,
      },
      createdBy: {
        firstName: eventPayload.triggeredBy.firstName,
        email: eventPayload.triggeredBy.email,
      },
    };
  }
  public createEmailTemplatePayloadSpaceCollaborationCalloutPublished(
    eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    recipient: User
  ): CollaborationCalloutPublishedEmailPayload {
    const framing = eventPayload.callout.framing;

    const result: CollaborationCalloutPublishedEmailPayload = {
      ...this.createSpaceBaseEmailPayload(eventPayload, recipient),
      publishedBy: {
        firstName: eventPayload.triggeredBy.firstName,
      },
      callout: {
        displayName: framing.displayName,
        url: framing.url,
        type: this.normalizeCalloutType(framing.type),
      },
    };
    return result;
  }

  // Maps the 7 allowed reaction slugs to their Unicode glyphs. An unknown
  // slug (e.g. from a future allow-list extension) renders as a humanized
  // text fallback so the email still makes sense without crashing.
  private static readonly SLUG_TO_GLYPH: Record<string, string> = {
    heart: '❤️',
    'hugging-face': '🤗',
    'clapping-hands': '👏',
    'light-bulb': '💡',
    bullseye: '🎯',
    'check-mark': '✅',
    rocket: '🚀',
  };

  private resolveEmojiGlyph(slug: string): string {
    return (
      NotificationEmailPayloadBuilderService.SLUG_TO_GLYPH[slug] ??
      slug.replace(/-/g, ' ')
    );
  }

  public createEmailTemplatePayloadSpaceCollaborationCalloutReaction(
    eventPayload: NotificationEventPayloadSpaceCollaborationCalloutReaction,
    recipient: User
  ): SpaceCollaborationCalloutReactionEmailPayload {
    return {
      ...this.createSpaceBaseEmailPayload(eventPayload, recipient),
      reactor: {
        displayName: eventPayload.triggeredBy.profile.displayName,
      },
      reaction: {
        emoji: eventPayload.reaction.emoji,
        emojiGlyph: this.resolveEmojiGlyph(eventPayload.reaction.emoji),
      },
      callout: {
        displayName: eventPayload.callout.framing.displayName,
        url: eventPayload.callout.framing.url,
      },
    };
  }

  public createEmailTemplatePayloadUserCommentReply(
    eventPayload: NotificationEventPayloadUserMessageRoomReply,
    recipient: User
  ): CommentReplyEmailPayload {
    return {
      ...this.createBaseEmailPayload(eventPayload, recipient),
      reply: {
        message: eventPayload.reply,
        createdBy: eventPayload.triggeredBy.profile.displayName,
        createdByUrl: eventPayload.triggeredBy.profile.url,
      },
      comment: eventPayload.comment,
    };
  }
  public createEmailTemplatePayloadUserMention(
    eventPayload: NotificationEventPayloadUserMessageRoom,
    recipient: User
  ): CommunicationUserMentionEmailPayload {
    const htmlComment: string = convertMarkdownToText(eventPayload.comment);

    return {
      ...this.createBaseEmailPayload(eventPayload, recipient),
      commentSender: {
        displayName: eventPayload.triggeredBy.profile.displayName,
        firstName: eventPayload.triggeredBy.firstName,
      },
      comment: htmlComment,
      commentOrigin: {
        url: eventPayload.commentOrigin.url,
        displayName: eventPayload.commentOrigin.displayName,
      },
    };
  }
  public createEmailTemplatePayloadPlatformAdminSpaceCreated(
    eventPayload: NotificationEventPayloadPlatformSpaceCreated,
    recipient: User
  ): SpaceCreatedEmailPayload {
    return {
      ...this.createSpaceBaseEmailPayload(eventPayload, recipient),
      sender: eventPayload.sender,
      dateCreated: new Date(eventPayload.created).toLocaleString('en-GB', {
        timeZone: 'UTC',
      }),
    };
  }

  public createEmailTemplatePayloadSpacePollVoteCastOnOwnPoll(
    eventPayload: NotificationEventPayloadSpacePollVoteCastOnOwnPoll,
    recipient: User
  ): PollVoteCastEmailPayload {
    return {
      ...this.createSpaceBaseEmailPayload(eventPayload, recipient),
      poll: {
        calloutTitle: eventPayload.poll.calloutTitle,
        calloutUrl: eventPayload.poll.calloutUrl,
      },
      voter: {
        name: eventPayload.triggeredBy.profile.displayName,
      },
    };
  }

  public createEmailTemplatePayloadSpacePollVoteCastOnPollIVotedOn(
    eventPayload: NotificationEventPayloadSpacePollVoteCastOnPollIVotedOn,
    recipient: User
  ): PollVoteCastEmailPayload {
    return {
      ...this.createSpaceBaseEmailPayload(eventPayload, recipient),
      poll: {
        calloutTitle: eventPayload.poll.calloutTitle,
        calloutUrl: eventPayload.poll.calloutUrl,
      },
      voter: {
        name: eventPayload.triggeredBy.profile.displayName,
      },
    };
  }

  public createEmailTemplatePayloadSpacePollModifiedOnPollIVotedOn(
    eventPayload: NotificationEventPayloadSpacePollModifiedOnPollIVotedOn,
    recipient: User
  ): PollModifiedEmailPayload {
    return {
      ...this.createSpaceBaseEmailPayload(eventPayload, recipient),
      poll: {
        calloutTitle: eventPayload.poll.calloutTitle,
        calloutUrl: eventPayload.poll.calloutUrl,
      },
    };
  }

  public createEmailTemplatePayloadSpacePollVoteAffectedByOptionChange(
    eventPayload: NotificationEventPayloadSpacePollVoteAffectedByOptionChange,
    recipient: User
  ): PollModifiedEmailPayload {
    return {
      ...this.createSpaceBaseEmailPayload(eventPayload, recipient),
      poll: {
        calloutTitle: eventPayload.poll.calloutTitle,
        calloutUrl: eventPayload.poll.calloutUrl,
      },
    };
  }

  /**
   * Creates the base email payload with common properties: recipient and platform
   */
  private createBaseEmailPayload(
    eventPayload: BaseEventPayload,
    recipient: User
  ): BaseEmailPayload {
    const notificationPreferenceURL =
      this.createUserNotificationPreferencesURL(recipient);

    return {
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }

  private createSpaceBaseEmailPayload(
    eventPayload: NotificationEventPayloadSpace,
    recipient: User
  ): BaseSpaceEmailPayload {
    const isLevel0Space = eventPayload.space.level === '0';
    const spaceType = isLevel0Space ? 'space' : 'subspace';
    return {
      ...this.createBaseEmailPayload(eventPayload, recipient),
      space: {
        displayName: eventPayload.space.profile.displayName,
        level: eventPayload.space.level,
        url: eventPayload.space.profile.url,
        type: spaceType,
      },
    };
  }

  private isExistingAlkemioUser(user: User | PlatformUser): boolean {
    return (user as User).id !== undefined;
  }

  private createUserNotificationPreferencesURL(
    user: User | PlatformUser
  ): string {
    if (!this.isExistingAlkemioUser(user)) {
      return '';
    }
    const userProfileURL = (user as User).profile.url;
    return `${userProfileURL}/settings/notifications`;
  }

  /**
   * Normalizes the callout framing type.
   * If the type is null, undefined, or 'none', returns 'Post' as the default.
   * Otherwise returns the original type.
   *
   * @param framingType - The callout framing type to normalize
   * @returns The normalized callout type
   */
  private normalizeCalloutType(framingType: string | null | undefined): string {
    return !framingType || framingType.toLowerCase() === 'none'
      ? 'Post'
      : framingType;
  }

  /**
   * Formats an ISO 8601 instant as a human-readable UTC string with an
   * explicit "UTC" label, e.g. "20 May 2026, 14:32 UTC" (FR-018). Date and
   * time are formatted separately so the separator is a comma — en-GB's
   * combined format uses " at ", which the spec example does not.
   */
  private formatChangeTimestampUTC(isoTimestamp: string): string {
    const date = new Date(isoTimestamp);
    if (Number.isNaN(date.getTime())) {
      return isoTimestamp;
    }
    const datePart = date.toLocaleDateString('en-GB', {
      timeZone: 'UTC',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const timePart = date.toLocaleTimeString('en-GB', {
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return `${datePart}, ${timePart} UTC`;
  }
}
