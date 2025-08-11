import { Injectable } from '@nestjs/common';
import { PlatformUser, User } from '@core/models';
import { SpaceCommunityPlatformInvitationCreatedEventPayload } from '@alkemio/notifications-lib';
import { EmailTemplate } from '@common/enums/email.template';
import { SpaceCommunityInvitationPlatformCreatedEmailPayload } from '@common/email-template-payload';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { ConfigService } from '@nestjs/config';
import { ConfigurationTypes } from '@src/common/enums';
import { INotificationBuilder } from '../notification.builder.interface';

@Injectable()
export class SpaceCommunityInvitationPlatformCreatedNotificationBuilder
  implements INotificationBuilder
{
  invitationsPath: string;
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly configService: ConfigService
  ) {
    this.invitationsPath = this.configService.get(
      ConfigurationTypes.ALKEMIO
    )?.webclient_invitations_path;
  }

  emailTemplate = EmailTemplate.SPACE_COMMUNITY_PLATFORM_INVITATION_INVITEE;

  public createEmailTemplatePayload(
    eventPayload: SpaceCommunityPlatformInvitationCreatedEventPayload,
    recipient: User | PlatformUser,
    inviter?: User
  ): SpaceCommunityInvitationPlatformCreatedEmailPayload {
    if (!inviter) {
      throw Error(`Invitee not provided for '${eventPayload.eventType}' event`);
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);
    const emails = [...eventPayload.invitees]
      .map(invitedUser => invitedUser.email)
      .join(', ');
    const invitationsURL = `${eventPayload.platform.url.replace(/\/+$/, '')}${
      this.invitationsPath
    }`;

    return {
      inviter: {
        firstName: inviter.firstName,
        name: inviter.profile.displayName,
        email: inviter.email,
        profile: inviter.profile.url,
      },
      spaceAdminURL: eventPayload.space.adminURL,
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      emails: emails,
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
}
