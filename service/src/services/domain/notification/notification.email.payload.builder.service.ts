import { Injectable } from '@nestjs/common';
import { User } from '@core/models';
import { createUserNotificationPreferencesURL } from '@src/core/util/createNotificationUrl';
import { CommunityApplicationCreatedEmailPayload } from '@common/email-template-payload';
import { NotificationEventPayloadSpaceCommunityApplication } from '@alkemio/notifications-lib';
import { ConfigurationTypes } from '@src/common/enums/configuration.type';
import { ConfigService } from '@nestjs/config';

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
}
