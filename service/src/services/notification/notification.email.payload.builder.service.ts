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
  CommunicationOrganizationMessageEmailPayload,
  CommunicationOrganizationMentionEmailPayload,
  CommunicationUserMentionEmailPayload,
  SpaceCommunicationMessageDirectEmailPayload,
  CollaborationPostCreatedEmailPayload,
  SpaceCollaborationCalloutCommentEmailPayload,
  CollaborationPostCommentEmailPayload,
  CollaborationCalloutPublishedEmailPayload,
  CommentReplyEmailPayload,
  PlatformUserRegisteredEmailPayload,
  PlatformForumDiscussionCreatedEmailPayload,
  PlatformForumDiscussionCommentEmailPayload,
  SpaceCreatedEmailPayload,
  SpaceCommunityInvitationPlatformCreatedEmailPayload,
  CommunityInvitationVirtualContributorCreatedEmailPayload,
  CommunityInvitationVirtualContributorDeclinedEmailPayload,
  SpaceCommunityCalendarEventCreatedEmailPayload,
  PlatformGlobalRoleChangeEmailPayload,
  PlatformUserRemovedEmailPayload,
  BaseEmailPayload,
  BaseSpaceEmailPayload,
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
  BaseEventPayload,
  NotificationEventPayloadSpace,
} from '@alkemio/notifications-lib';
import { ConfigurationTypes } from '@src/common/enums/configuration.type';
import { ConfigService } from '@nestjs/config';
import { EventPayloadNotProvidedException } from '@src/common/exceptions/event.payload.not.provided.exception';
import { LogContext } from '@src/common/enums';
import { RoleSetContributorType } from '@src/generated/alkemio-schema';

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
      newMember.type.toLowerCase() ===
      RoleSetContributorType.Virtual.toLowerCase()
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
      newMember.type.toLowerCase() ===
      RoleSetContributorType.Virtual.toLowerCase()
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
    return {
      ...this.createSpaceBaseEmailPayload(eventPayload, recipient),
      creator: {
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
}
