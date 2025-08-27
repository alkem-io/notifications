import { Injectable } from '@nestjs/common';
import { User } from '@core/models';
import { createUserNotificationPreferencesURL } from '@src/core/util/createNotificationUrl';
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
import { convertMarkdownToHtml } from '@src/utils/markdown-to-html.util';
import { convertMarkdownToText } from '@src/utils/markdown-to-text.util';
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
  ): any {
    return undefined;
  }
  public createEmailTemplatePayloadUserSignUpWelcome(
    eventPayload: NotificationEventPayloadPlatformUserRegistration,
    recipient: User
  ): any {
    return undefined;
  }
  public createEmailTemplatePayloadPlatformAdminUserProfileCreated(
    eventPayload: NotificationEventPayloadPlatformUserRegistration,
    recipient: User
  ): any {
    return undefined;
  }
  public createEmailTemplatePayloadPlatformUserRemoved(
    eventPayload: NotificationEventPayloadPlatformUserRemoved,
    recipient: User
  ): any {
    return undefined;
  }
  public createEmailTemplatePayloadPlatformForumDiscussionComment(
    eventPayload: NotificationEventPayloadPlatformForumDiscussion,
    recipient: User
  ): any {
    return undefined;
  }
  public createEmailTemplatePayloadPlatformForumDiscussionCreated(
    eventPayload: NotificationEventPayloadPlatformForumDiscussion,
    recipient: User
  ): any {
    return undefined;
  }
  public createEmailTemplatePayloadSpaceCommunicationUpdate(
    eventPayload: NotificationEventPayloadSpaceCommunicationUpdate,
    recipient: User
  ): any {
    return undefined;
  }
  public createEmailTemplatePayloadUserMessage(
    eventPayload: NotificationEventPayloadUserMessageDirect,
    recipient: User
  ): any {
    return undefined;
  }
  public createEmailTemplatePayloadUserMessageSender(
    eventPayload: NotificationEventPayloadUserMessageDirect,
    recipient: User
  ): any {
    return undefined;
  }
  public createEmailTemplatePayloadOrganizationMessage(
    eventPayload: NotificationEventPayloadOrganizationMessageDirect,
    recipient: User
  ): any {
    return undefined;
  }
  public createEmailTemplatePayloadOrganizationMessageSender(
    eventPayload: NotificationEventPayloadOrganizationMessageDirect,
    recipient: User
  ): any {
    return undefined;
  }
  public createEmailTemplatePayloadOrganizationMention(
    eventPayload: NotificationEventPayloadOrganizationMessageRoom,
    recipient: User
  ): any {
    return undefined;
  }
  public createEmailTemplatePayloadSpaceCommunicationMessage(
    eventPayload: NotificationEventPayloadSpaceCommunicationMessageDirect,
    recipient: User
  ): any {
    return undefined;
  }
  public createEmailTemplatePayloadSpaceCommunicationMessageSender(
    eventPayload: NotificationEventPayloadSpaceCommunicationMessageDirect,
    recipient: User
  ): any {
    return undefined;
  }
  public createEmailTemplatePayloadSpaceCollaborationCalloutContribution(
    eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    recipient: User
  ): any {
    return undefined;
  }
  public createEmailTemplatePayloadSpaceAdminCollaborationCalloutContribution(
    eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    recipient: User
  ): any {
    return undefined;
  }
  public createEmailTemplatePayloadSpaceCollaborationCalloutComment(
    eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    recipient: User
  ): any {
    return undefined;
  }
  public createEmailTemplatePayloadSpaceCollaborationCalloutPostContributionComment(
    eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    recipient: User
  ): any {
    return undefined;
  }
  public createEmailTemplatePayloadSpaceCollaborationCalloutPublished(
    eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    recipient: User
  ): any {
    return undefined;
  }
  public createEmailTemplatePayloadUserCommentReply(
    eventPayload: NotificationEventPayloadUserMessageRoomReply,
    recipient: User
  ): any {
    return undefined;
  }
  public createEmailTemplatePayloadUserMention(
    eventPayload: NotificationEventPayloadUserMessageRoom,
    recipient: User
  ): any {
    return undefined;
  }
  public createEmailTemplatePayloadPlatformAdminSpaceCreated(
    eventPayload: NotificationEventPayloadPlatformSpaceCreated,
    recipient: User
  ): any {
    return undefined;
  }
}
