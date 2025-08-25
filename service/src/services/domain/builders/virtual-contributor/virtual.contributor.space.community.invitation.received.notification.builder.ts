import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '../notification.builder.interface';
import { User } from '@core/models';
import { CommunityInvitationVirtualContributorCreatedEmailPayload } from '@src/common/email-template-payload';
import { NotificationEventPayloadSpaceCommunityInvitationVirtualContributor } from '@alkemio/notifications-lib';
import { createUserNotificationPreferencesURL } from '@src/core/util/createNotificationUrl';

@Injectable()
export class SpaceCommunityInvitationVirtualContributorCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor() {}

  public createEmailTemplatePayload(
    eventPayload: NotificationEventPayloadSpaceCommunityInvitationVirtualContributor,
    recipient: User
  ): CommunityInvitationVirtualContributorCreatedEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);

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
