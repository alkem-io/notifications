import { Inject, Injectable } from '@nestjs/common';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { User } from '@core/models';
import { PlatformUserRegistrationEventPayload } from '@alkemio/notifications-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator';
import { INotificationBuilder } from '@core/contracts/notification.builder.interface';
import { NotificationBuilder, RoleConfig } from '../../../application';
import { UserPreferenceType } from '@alkemio/client-lib';
import { EmailTemplate } from '@common/enums/email.template';
import { NotificationTemplateType } from '@src/types/notification.template.type';
import { PlatformUserRegisteredEmailPayload } from '@common/email-template-payload';
import { ALKEMIO_URL_GENERATOR } from '@src/common/enums/providers';

@Injectable()
export class PlatformUserRegisteredNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    @Inject(ALKEMIO_URL_GENERATOR)
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
        preferenceType: UserPreferenceType.NotificationUserSignUp,
      },
      {
        role: 'registrant',
        emailTemplate: EmailTemplate.PLATFORM_USER_REGISTRATION_REGISTRANT,
      },
    ];

    const templateVariables = { registrantID: payload.userID };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.userID,
      roleConfig,
      templateType: 'platform_user_registered',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  private createTemplatePayload(
    eventPayload: PlatformUserRegistrationEventPayload,
    recipient: User,
    registrant?: User
  ): PlatformUserRegisteredEmailPayload {
    if (!registrant) {
      throw Error(
        `Registrant not provided for '${NotificationEventType.PLATFORM_USER_REGISTERED}' event`
      );
    }

    const registrantProfileURL = this.alkemioUrlGenerator.createUserURL(
      registrant.nameID
    );
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(
        recipient.nameID
      );
    const alkemioURL = this.alkemioUrlGenerator.createPlatformURL();
    return {
      emailFrom: 'info@alkem.io',
      registrant: {
        displayName: registrant.displayName,
        firstName: registrant.firstName,
        email: registrant.email,
        profile: registrantProfileURL,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      platform: {
        url: alkemioURL,
      },
    };
  }
}
