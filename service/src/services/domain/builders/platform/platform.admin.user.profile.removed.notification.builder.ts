import { Injectable } from '@nestjs/common';
import { User } from '@core/models';
import { INotificationBuilder } from '@src/services/domain/builders/notification.builder.interface';
import { createUserNotificationPreferencesURL } from '@src/core/util/createNotificationUrl';
import { PlatformUserRemovedEmailPayload } from '@src/common/email-template-payload/platform.user.removed.email.payload';
import { NotificationEventPayloadPlatformUserRemoved } from '@alkemio/notifications-lib';
@Injectable()
export class PlatformAdminUserProfileRemovedNotificationBuilder
  implements INotificationBuilder
{
  constructor() {}

  public createEmailTemplatePayload(
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
}
