import { Injectable } from '@nestjs/common';
import { PlatformUser, User } from '@core/models';
import { INotificationBuilder } from '@src/services/domain/builders/notification.builder.interface';
import { EmailTemplate } from '@common/enums/email.template';
import { PlatformUserRegisteredEmailPayload } from '@common/email-template-payload';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { PlatformUserRegistrationEventPayload } from '@alkemio/notifications-lib';
@Injectable()
export class PlatformUserRegisteredAdminNotificationBuilder
  implements INotificationBuilder
{
  constructor(private readonly alkemioUrlGenerator: AlkemioUrlGenerator) {}

  emailTemplate = EmailTemplate.PLATFORM_USER_REGISTRATION_ADMIN;

  public createEmailTemplatePayload(
    eventPayload: PlatformUserRegistrationEventPayload,
    recipient: User | PlatformUser,
    registrant?: User
  ): PlatformUserRegisteredEmailPayload {
    if (!registrant) {
      throw Error(
        `Registrant not provided for '${eventPayload.eventType}' event`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);
    return {
      registrant: {
        displayName: registrant.profile.displayName,
        firstName: registrant.firstName,
        email: registrant.email,
        profile: registrant.profile.url,
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
