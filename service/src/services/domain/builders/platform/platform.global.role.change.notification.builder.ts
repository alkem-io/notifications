import { Injectable } from '@nestjs/common';
import { PlatformUser, User } from '@core/models';
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
    recipient: User | PlatformUser,
    user?: User
  ): PlatformGlobalRoleChangeEmailPayload {
    if (!user) {
      throw Error(`User not provided for '${eventPayload.eventType}' event`);
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);
    return {
      user: {
        displayName: user.profile.displayName,
        firstName: user.firstName,
        email: user.email,
        profile: user.profile.url,
      },
      actor: {
        displayName: eventPayload.actor.profile.displayName,
        url: eventPayload.actor.profile.url,
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
