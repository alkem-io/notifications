import { Injectable } from '@nestjs/common';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { PlatformUser, User } from '@core/models';
import { PlatformUserRegistrationEventPayload } from '@alkemio/notifications-lib';
import { INotificationBuilder } from '@core/contracts/notification.builder.interface';
import { NotificationBuilder, RoleConfig } from '../../../application';
import { PreferenceType } from '@alkemio/client-lib';
import { EmailTemplate } from '@common/enums/email.template';
import { NotificationTemplateType } from '@src/types/notification.template.type';
import { PlatformUserRegisteredEmailPayload } from '@common/email-template-payload';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';

@Injectable()
export class PlatformUserRegisteredNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<
      PlatformUserRegistrationEventPayload,
      PlatformUserRegisteredEmailPayload
    >
  ) {}

  build(
    payload: PlatformUserRegistrationEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'admin',
        emailTemplate: EmailTemplate.PLATFORM_USER_REGISTRATION_ADMIN,
        preferenceType: PreferenceType.NotificationUserSignUp,
      },
      {
        role: 'registrant',
        emailTemplate: EmailTemplate.PLATFORM_USER_REGISTRATION_REGISTRANT,
      },
    ];

    const templateVariables = { registrantID: payload.user.id };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.user.id,
      roleConfig,
      templateType: 'platform_user_registered',
      templateVariables,
      templatePayloadBuilderFn: this.createEmailTemplatePayload.bind(this),
    });
  }

  private createEmailTemplatePayload(
    eventPayload: PlatformUserRegistrationEventPayload,
    recipient: User | PlatformUser,
    registrant?: User
  ): PlatformUserRegisteredEmailPayload {
    if (!registrant) {
      throw Error(
        `Registrant not provided for '${NotificationEventType.PLATFORM_USER_REGISTERED}' event`
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
