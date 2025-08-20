import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '../notification.builder.interface';
import { EmailTemplate } from '@src/common/enums/email.template';
import { User } from '@src/core/models';
import { SpaceCreatedEmailPayload } from '@src/common/email-template-payload';
import { NotificationEventPayloadPlatformSpaceCreated } from '@alkemio/notifications-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';

@Injectable()
export class PlatformSpaceCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(private readonly alkemioUrlGenerator: AlkemioUrlGenerator) {}

  emailTemplate = EmailTemplate.PLATFORM_SPACE_CREATED_ADMIN;

  createEmailTemplatePayload(
    eventPayload: NotificationEventPayloadPlatformSpaceCreated,
    recipient: User
  ): SpaceCreatedEmailPayload {
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);

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
