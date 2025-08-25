import { Injectable } from '@nestjs/common';
import { User } from '@core/models';
import { INotificationBuilder } from '@src/services/domain/builders/notification.builder.interface';
import { createUserNotificationPreferencesURL } from '@src/core/util/createNotificationUrl';
import { PlatformGlobalRoleChangeEmailPayload } from '@src/common/email-template-payload/platform.global.role.change.email.payload';
import { NotificationEventPayloadPlatformGlobalRole } from '@alkemio/notifications-lib';
@Injectable()
export class PlatformAdminGlobalRoleChangeNotificationBuilder
  implements INotificationBuilder
{
  constructor() {}

  public createEmailTemplatePayload(
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
}
