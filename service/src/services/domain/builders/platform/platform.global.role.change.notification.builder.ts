import { Injectable } from '@nestjs/common';
import { User } from '@core/models';
import { INotificationBuilder } from '@src/services/domain/builders/notification.builder.interface';
import { EmailTemplate } from '@common/enums/email.template';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { PlatformGlobalRoleChangeEmailPayload } from '@src/common/email-template-payload/platform.global.role.change.email.payload';
import { PlatformGlobalRoleChangeEventPayload } from '@alkemio/notifications-lib';
@Injectable()
export class PlatformGlobalRoleChangeNotificationBuilder
  implements INotificationBuilder
{
  constructor(private readonly alkemioUrlGenerator: AlkemioUrlGenerator) {}

  emailTemplate = EmailTemplate.PLATFORM_GLOBAL_ROLE_CHANGE_ADMIN;

  public createEmailTemplatePayload(
    eventPayload: PlatformGlobalRoleChangeEventPayload,
    recipient: User
  ): PlatformGlobalRoleChangeEmailPayload {
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);
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
