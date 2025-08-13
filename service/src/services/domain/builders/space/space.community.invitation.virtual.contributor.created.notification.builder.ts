import { Injectable } from '@nestjs/common';
import { SpaceCommunityInvitationVirtualContributorCreatedEventPayload } from '@alkemio/notifications-lib';
import { INotificationBuilder } from '../notification.builder.interface';
import { User } from '@core/models';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { EmailTemplate } from '@src/common/enums/email.template';
import { CommunityInvitationVirtualContributorCreatedEmailPayload } from '@src/common/email-template-payload';

@Injectable()
export class SpaceCommunityInvitationVirtualContributorCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(private readonly alkemioUrlGenerator: AlkemioUrlGenerator) {}

  emailTemplate = EmailTemplate.SPACE_COMMUNITY_INVITATION_CREATED_VC_HOST;

  public createEmailTemplatePayload(
    eventPayload: SpaceCommunityInvitationVirtualContributorCreatedEventPayload,
    recipient: User
  ): CommunityInvitationVirtualContributorCreatedEmailPayload {
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);

    return {
      inviter: {
        firstName: eventPayload.triggeredBy.firstName,
        name: eventPayload.triggeredBy.profile.displayName,
        profile: eventPayload.triggeredBy.profile.url,
        email: eventPayload.triggeredBy.email,
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
      virtualContributor: {
        name: eventPayload.invitee.profile.displayName,
        url: eventPayload.invitee.profile.url,
      },
      platform: {
        url: eventPayload.platform.url,
      },
      welcomeMessage: eventPayload.welcomeMessage,
      spaceAdminURL: eventPayload.space.adminURL,
    };
  }
}
