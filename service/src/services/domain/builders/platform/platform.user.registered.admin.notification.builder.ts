import { Injectable } from '@nestjs/common';
import { User } from '@core/models';
import { INotificationBuilder } from '@src/services/domain/builders/notification.builder.interface';
import { EmailTemplate } from '@common/enums/email.template';
import { createUserNotificationPreferencesURL } from '@src/core/util/createNotificationUrl';
import { PlatformUserRegisteredEmailPayload } from '@common/email-template-payload';
import { NotificationEventPayloadPlatformUserRegistration } from '@alkemio/notifications-lib';
@Injectable()
export class PlatformUserRegisteredAdminNotificationBuilder
  implements INotificationBuilder
{
  constructor() {}

  emailTemplate = EmailTemplate.PLATFORM_USER_REGISTRATION_ADMIN;

  public createEmailTemplatePayload(
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
}
