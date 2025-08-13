import { Injectable } from '@nestjs/common';
import { User } from '@core/models';
import { INotificationBuilder } from '@src/services/domain/builders/notification.builder.interface';
import { EmailTemplate } from '@common/enums/email.template';
import { PlatformUserRemovedEmailPayload } from '@src/common/email-template-payload/platform.user.removed.email.payload';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { PlatformUserRemovedEventPayload } from '@alkemio/notifications-lib';
@Injectable()
export class PlatformUserRemovedNotificationBuilder
  implements INotificationBuilder
{
  constructor(private readonly alkemioUrlGenerator: AlkemioUrlGenerator) {}

  emailTemplate = EmailTemplate.PLATFORM_USER_REMOVED_ADMIN;

  public createEmailTemplatePayload(
    eventPayload: PlatformUserRemovedEventPayload,
    recipient: User
  ): PlatformUserRemovedEmailPayload {
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);
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
