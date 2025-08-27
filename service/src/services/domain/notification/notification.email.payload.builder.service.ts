import { Injectable } from '@nestjs/common';
import { User } from '@core/models';
import { createUserNotificationPreferencesURL } from '@src/core/util/createNotificationUrl';
import { normalizeCalloutType } from '@src/utils/callout.util';
import { convertMarkdownToText } from '@src/utils/markdown-to-text.util';
import { convertMarkdownToHtml } from '@src/utils/markdown-to-html.util';
import {
  CommunityApplicationCreatedEmailPayload,
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
  PlatformGlobalRoleChangeEmailPayload,
  PlatformUserRemovedEmailPayload,
} from '@common/email-template-payload';
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
    const isLevel0Space = eventPayload.space.level === '0';
    const spaceType = isLevel0Space ? 'space' : 'subspace';

    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);
    return {
      applicant: {
        firstName: eventPayload.triggeredBy.firstName,
        name: eventPayload.triggeredBy.profile.displayName,
        email: eventPayload.triggeredBy.email,
        profile: eventPayload.triggeredBy.profile.url,
      },
      spaceAdminURL: eventPayload.space.adminURL,
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      space: {
        displayName: eventPayload.space.profile.displayName,
        level: eventPayload.space.level,
        url: eventPayload.space.profile.url,
        type: spaceType,
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }

  public createEmailTemplatePayloadSpaceAdminCommunityApplication(
    eventPayload: NotificationEventPayloadSpaceCommunityApplication,
    recipient: User
  ): CommunityApplicationCreatedEmailPayload {
    const isLevel0Space = eventPayload.space.level === '0';
    const spaceType = isLevel0Space ? 'space' : 'subspace';

    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);
    return {
      applicant: {
        firstName: eventPayload.triggeredBy.firstName,
        name: eventPayload.triggeredBy.profile.displayName,
        email: eventPayload.triggeredBy.email,
        profile: eventPayload.triggeredBy.profile.url,
      },
      spaceAdminURL: eventPayload.space.adminURL,
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      space: {
        displayName: eventPayload.space.profile.displayName,
        level: eventPayload.space.level,
        url: eventPayload.space.profile.url,
        type: spaceType,
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }

  public createEmailTemplatePayloadUserSpaceCommunityInvitation(
    eventPayload: NotificationEventPayloadSpaceCommunityInvitation,
    recipient: User
  ): CommunityInvitationCreatedEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);
    const invitationsURL = `${eventPayload.platform.url.replace(/\/+$/, '')}${
      this.invitationsPath
    }`;

    return {
      inviter: {
        firstName: eventPayload.triggeredBy.firstName,
        name: eventPayload.triggeredBy.profile.displayName,
        email: eventPayload.triggeredBy.email,
        profile: eventPayload.triggeredBy.profile.url,
      },
      spaceAdminURL: eventPayload.space.adminURL,
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      welcomeMessage: eventPayload.welcomeMessage,
      space: {
        displayName: eventPayload.space.profile.displayName,
        level: eventPayload.space.level,
        url: eventPayload.space.profile.url,
      },
      platform: {
        url: eventPayload.platform.url,
      },
      invitationsURL,
    };
  }

  public createEmailTemplatePayloadVirtualContributorInvitation(
    eventPayload: NotificationEventPayloadSpaceCommunityInvitationVirtualContributor,
    recipient: User
  ): CommunityInvitationVirtualContributorCreatedEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);

    return {
      inviter: {
        firstName: eventPayload.triggeredBy.firstName,
        name: eventPayload.triggeredBy.profile.displayName,
        email: eventPayload.triggeredBy.email,
        profile: eventPayload.triggeredBy.profile.url,
      },
      spaceAdminURL: eventPayload.space.adminURL,
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      welcomeMessage: eventPayload.welcomeMessage,
      space: {
        displayName: eventPayload.space.profile.displayName,
        level: eventPayload.space.level,
        url: eventPayload.space.profile.url,
      },
      platform: {
        url: eventPayload.platform.url,
      },
      virtualContributor: {
        name: eventPayload.host.profile.displayName,
        url: eventPayload.host.profile.url,
      },
    };
  }

  public createEmailTemplatePayloadSpaceCommunityInvitationPlatform(
    eventPayload: NotificationEventPayloadSpaceCommunityInvitationPlatform,
    recipient: User
  ): SpaceCommunityInvitationPlatformCreatedEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);

    const invitationsURL = `${eventPayload.platform.url.replace(/\/+$/, '')}${
      this.invitationsPath
    }`;

    return {
      inviter: {
        firstName: eventPayload.triggeredBy.firstName,
        name: eventPayload.triggeredBy.profile.displayName,
        email: eventPayload.triggeredBy.email,
        profile: eventPayload.triggeredBy.profile.url,
      },
      spaceAdminURL: eventPayload.space.adminURL,
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      emails: recipient.email,
      welcomeMessage: eventPayload.welcomeMessage,
      space: {
        displayName: eventPayload.space.profile.displayName,
        level: eventPayload.space.level,
        url: eventPayload.space.profile.url,
      },
      platform: {
        url: eventPayload.platform.url,
      },
      invitationsURL,
    };
  }

  public createEmailTemplatePayloadUserSpaceCommunityJoined(
    eventPayload: NotificationEventPayloadSpaceCommunityContributor,
    recipient: User
  ): CommunityNewMemberEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);

    const newMember = eventPayload.contributor;
    const typeName =
      newMember.type === RoleSetContributorType.Virtual
        ? 'virtual contributor'
        : newMember.type;

    return {
      member: {
        name: newMember.profile.displayName,
        profile: newMember.profile.url,
        type: typeName,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      space: {
        displayName: eventPayload.space.profile.displayName,
        level: eventPayload.space.level,
        url: eventPayload.space.profile.url,
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }

  public createEmailTemplatePayloadSpaceAdminCommunityNewMember(
    eventPayload: NotificationEventPayloadSpaceCommunityContributor,
    recipient: User
  ): CommunityNewMemberEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);

    const newMember = eventPayload.contributor;
    const typeName =
      newMember.type === RoleSetContributorType.Virtual
        ? 'virtual contributor'
        : newMember.type;

    return {
      member: {
        name: newMember.profile.displayName,
        profile: newMember.profile.url,
        type: typeName,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      space: {
        displayName: eventPayload.space.profile.displayName,
        level: eventPayload.space.level,
        url: eventPayload.space.profile.url,
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }

  // Placeholder methods for the remaining notification types - these need to be implemented
  public createEmailTemplatePayloadPlatformGlobalRoleChange(
    eventPayload: NotificationEventPayloadPlatformGlobalRole,
    recipient: User
  ): PlatformGlobalRoleChangeEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);
    return {
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
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      role: eventPayload.role,
      type: eventPayload.type,
      platform: {
        url: eventPayload.platform.url,
      },
      triggeredBy: eventPayload.triggeredBy.id,
    };
  }

  public createEmailTemplatePayloadUserSignUpWelcome(
    eventPayload: NotificationEventPayloadPlatformUserRegistration,
    recipient: User
  ): PlatformUserRegisteredEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);
    return {
      registrant: {
        displayName: eventPayload.user.profile.displayName,
        firstName: eventPayload.user.firstName,
        email: eventPayload.user.email,
        profile: eventPayload.user.profile.url,
      },
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

  public createEmailTemplatePayloadPlatformAdminUserProfileCreated(
    eventPayload: NotificationEventPayloadPlatformUserRegistration,
    recipient: User
  ): PlatformUserRegisteredEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);
    return {
      registrant: {
        displayName: eventPayload.user.profile.displayName,
        firstName: eventPayload.user.firstName,
        email: eventPayload.user.email,
        profile: eventPayload.user.profile.url,
      },
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

  public createEmailTemplatePayloadPlatformUserRemoved(
    eventPayload: NotificationEventPayloadPlatformUserRemoved,
    recipient: User
  ): PlatformUserRemovedEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);
    return {
      registrant: {
        displayName: eventPayload.user.displayName,
        email: eventPayload.user.email,
      },
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
  public createEmailTemplatePayloadPlatformForumDiscussionComment(
    eventPayload: NotificationEventPayloadPlatformForumDiscussion,
    recipient: User
  ): PlatformForumDiscussionCommentEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);
    const comment = eventPayload.comment;
    if (!comment) {
      throw new EventPayloadNotProvidedException(
        `comment missing in payload: ${eventPayload}`,
        LogContext.NOTIFICATION_BUILDER
      );
    }
    const result: PlatformForumDiscussionCommentEmailPayload = {
      comment: {
        createdBy: comment.createdBy.id,
        message: comment.message,
      },
      discussion: {
        displayName: eventPayload.discussion.displayName,
        createdBy: eventPayload.discussion.createdBy.id,
        url: eventPayload.discussion.url,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
    return result;
  }
  public createEmailTemplatePayloadPlatformForumDiscussionCreated(
    eventPayload: NotificationEventPayloadPlatformForumDiscussion,
    recipient: User
  ): PlatformForumDiscussionCreatedEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);
    return {
      createdBy: {
        firstName: eventPayload.triggeredBy.firstName,
      },
      discussion: {
        displayName: eventPayload.discussion.displayName,
        url: eventPayload.discussion.url,
      },
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
  public createEmailTemplatePayloadSpaceCommunicationUpdate(
    eventPayload: NotificationEventPayloadSpaceCommunicationUpdate,
    recipient: User
  ): CommunicationUpdateCreatedEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);

    return {
      sender: {
        firstName: eventPayload.triggeredBy.firstName,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      space: {
        displayName: eventPayload.space.profile.displayName,
        level: eventPayload.space.level,
        url: eventPayload.space.profile.url,
      },
      platform: {
        url: eventPayload.platform.url,
      },
      message: convertMarkdownToHtml(eventPayload.message ?? ''),
    };
  }
  public createEmailTemplatePayloadUserMessage(
    eventPayload: NotificationEventPayloadUserMessageDirect,
    recipient: User
  ): CommunicationUserMessageEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);

    return {
      messageSender: {
        displayName: eventPayload.triggeredBy.profile.displayName,
        firstName: eventPayload.triggeredBy.firstName,
        email: eventPayload.triggeredBy.email,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      message: eventPayload.message,
      platform: {
        url: eventPayload.platform.url,
      },
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
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);

    return {
      messageReceiver: {
        displayName: eventPayload.user.profile.displayName,
        firstName: eventPayload.user.firstName,
      },
      messageSender: {
        displayName: eventPayload.triggeredBy.profile.displayName,
        firstName: eventPayload.triggeredBy.firstName,
        email: eventPayload.triggeredBy.email,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      message: eventPayload.message,
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }
  public createEmailTemplatePayloadOrganizationMessage(
    eventPayload: NotificationEventPayloadOrganizationMessageDirect,
    recipient: User
  ): CommunicationOrganizationMessageEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);

    return {
      messageSender: {
        displayName: eventPayload.triggeredBy.profile.displayName,
        firstName: eventPayload.triggeredBy.firstName,
        email: eventPayload.triggeredBy.email,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      message: eventPayload.message,
      organization: {
        displayName: eventPayload.organization.profile.displayName,
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }
  public createEmailTemplatePayloadOrganizationMessageSender(
    eventPayload: NotificationEventPayloadOrganizationMessageDirect,
    recipient: User
  ): CommunicationOrganizationMessageEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);

    return {
      messageSender: {
        displayName: eventPayload.triggeredBy.profile.displayName,
        firstName: eventPayload.triggeredBy.firstName,
        email: eventPayload.triggeredBy.email,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      message: eventPayload.message,
      organization: {
        displayName: eventPayload.organization.profile.displayName,
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }
  public createEmailTemplatePayloadOrganizationMention(
    eventPayload: NotificationEventPayloadOrganizationMessageRoom,
    recipient: User
  ): CommunicationOrganizationMentionEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);

    const htmlComment: string = convertMarkdownToText(eventPayload.comment);

    return {
      commentSender: {
        displayName: eventPayload.triggeredBy.profile.displayName,
        firstName: eventPayload.triggeredBy.firstName,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      comment: htmlComment,
      platform: {
        url: eventPayload.platform.url,
      },
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
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);

    return {
      messageSender: {
        displayName: eventPayload.triggeredBy.profile.displayName,
        firstName: eventPayload.triggeredBy.firstName,
        email: eventPayload.triggeredBy.email,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      message: eventPayload.message,
      space: {
        displayName: eventPayload.space.profile.displayName,
        level: eventPayload.space.level,
        url: eventPayload.space.profile.url,
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }
  public createEmailTemplatePayloadSpaceCommunicationMessageSender(
    eventPayload: NotificationEventPayloadSpaceCommunicationMessageDirect,
    recipient: User
  ): SpaceCommunicationMessageDirectEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);

    return {
      messageSender: {
        displayName: eventPayload.triggeredBy.profile.displayName,
        firstName: eventPayload.triggeredBy.firstName,
        email: eventPayload.triggeredBy.email,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      message: eventPayload.message,
      space: {
        displayName: eventPayload.space.profile.displayName,
        level: eventPayload.space.level,
        url: eventPayload.space.profile.url,
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }
  public createEmailTemplatePayloadSpaceCollaborationCalloutContribution(
    eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    recipient: User
  ): CollaborationPostCreatedEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);

    const contribution = eventPayload.callout.contribution;
    if (!contribution) {
      throw new EventPayloadNotProvidedException(
        'Contribution not found',
        LogContext.NOTIFICATION_BUILDER
      );
    }
    return {
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
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      space: {
        displayName: eventPayload.space.profile.displayName,
        level: eventPayload.space.level,
        url: eventPayload.space.profile.url,
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }
  public createEmailTemplatePayloadSpaceAdminCollaborationCalloutContribution(
    eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    recipient: User
  ): CollaborationPostCreatedEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);

    const contribution = eventPayload.callout.contribution;
    if (!contribution) {
      throw new EventPayloadNotProvidedException(
        'Contribution not found',
        LogContext.NOTIFICATION_BUILDER
      );
    }
    return {
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
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      space: {
        displayName: eventPayload.space.profile.displayName,
        level: eventPayload.space.level,
        url: eventPayload.space.profile.url,
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }
  public createEmailTemplatePayloadSpaceCollaborationCalloutComment(
    eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    recipient: User
  ): SpaceCollaborationCalloutCommentEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);

    return {
      createdBy: {
        firstName: eventPayload.triggeredBy.firstName,
        email: eventPayload.triggeredBy.email,
      },
      callout: {
        displayName: eventPayload.callout.framing.displayName,
        url: eventPayload.callout.framing.url,
        type: normalizeCalloutType(eventPayload.callout.framing.type),
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      space: {
        displayName: eventPayload.space.profile.displayName,
        level: eventPayload.space.level,
        url: eventPayload.space.profile.url,
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }
  public createEmailTemplatePayloadSpaceCollaborationCalloutPostContributionComment(
    eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    recipient: User
  ): CollaborationPostCommentEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);
    const callout = eventPayload.callout;

    const contribution = eventPayload.callout.contribution;
    if (!contribution) {
      throw new EventPayloadNotProvidedException(
        'Contribution not found',
        LogContext.NOTIFICATION_BUILDER
      );
    }
    return {
      callout: {
        displayName: callout.framing.displayName,
        url: callout.framing.url,
      },
      post: {
        displayName: contribution.displayName,
        url: contribution.url,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      createdBy: {
        firstName: eventPayload.triggeredBy.firstName,
        email: eventPayload.triggeredBy.email,
      },
      space: {
        displayName: eventPayload.space.profile.displayName,
        level: eventPayload.space.level,
        url: eventPayload.space.profile.url,
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }
  public createEmailTemplatePayloadSpaceCollaborationCalloutPublished(
    eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    recipient: User
  ): CollaborationCalloutPublishedEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);

    const framing = eventPayload.callout.framing;

    const result: CollaborationCalloutPublishedEmailPayload = {
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      publishedBy: {
        firstName: eventPayload.triggeredBy.profile.displayName,
      },
      callout: {
        displayName: framing.displayName,
        url: framing.url,
        type: normalizeCalloutType(framing.type),
      },
      space: {
        displayName: eventPayload.space.profile.displayName,
        level: eventPayload.space.level,
        url: eventPayload.space.profile.url,
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
    return result;
  }
  public createEmailTemplatePayloadUserCommentReply(
    eventPayload: NotificationEventPayloadUserMessageRoomReply,
    recipient: User
  ): CommentReplyEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);

    return {
      reply: {
        message: eventPayload.reply,
        createdBy: eventPayload.triggeredBy.profile.displayName,
        createdByUrl: eventPayload.triggeredBy.profile.url,
      },
      comment: eventPayload.comment,
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
  public createEmailTemplatePayloadUserMention(
    eventPayload: NotificationEventPayloadUserMessageRoom,
    recipient: User
  ): CommunicationUserMentionEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);

    const htmlComment: string = convertMarkdownToText(eventPayload.comment);

    return {
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      commentSender: {
        displayName: eventPayload.triggeredBy.profile.displayName,
        firstName: eventPayload.triggeredBy.firstName,
      },
      comment: htmlComment,
      platform: {
        url: eventPayload.platform.url,
      },
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
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);

    return {
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      space: {
        displayName: eventPayload.space.profile.displayName,
        level: eventPayload.space.level,
        url: eventPayload.space.profile.url,
      },
      sender: eventPayload.sender,
      dateCreated: new Date(eventPayload.created).toLocaleString('en-GB', {
        timeZone: 'UTC',
      }),
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }
}
