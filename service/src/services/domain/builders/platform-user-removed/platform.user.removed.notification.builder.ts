import { Inject, Injectable } from '@nestjs/common';
import {
  NotificationEventType,
  PlatformUserRemovedEventPayload,
} from '@alkemio/notifications-lib';
import { User } from '@core/models';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator';
import { INotificationBuilder } from '@core/contracts/notification.builder.interface';
import { NotificationBuilder, RoleConfig } from '../../../application';
import { UserPreferenceType } from '@alkemio/client-lib';
import { EmailTemplate } from '@common/enums/email.template';
import { NotificationTemplateType } from '@src/types/notification.template.type';
import { PlatformUserRegisteredEmailPayload } from '@common/email-template-payload';
import { ALKEMIO_URL_GENERATOR } from '@src/common/enums/providers';
import { PlatformUserRemovedEmailPayload } from '@src/common/email-template-payload/platform.user.removed.email.payload';

@Injectable()
export class PlatformUserRemovedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    @Inject(ALKEMIO_URL_GENERATOR)
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<
      PlatformUserRemovedEventPayload,
      PlatformUserRegisteredEmailPayload
    >
  ) {}

  build(
    payload: PlatformUserRemovedEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'admin',
        emailTemplate: EmailTemplate.PLATFORM_USER_REMOVED_ADMIN,
        preferenceType: UserPreferenceType.NotificationUserSignUp,
      },
    ];

    const templateVariables = { registrantID: payload.userID };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.userID,
      roleConfig,
      templateType: 'platform_user_removed',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  private createTemplatePayload(
    eventPayload: PlatformUserRemovedEventPayload,
    recipient: User,
    registrant?: User
  ): PlatformUserRemovedEmailPayload {
    if (!registrant) {
      throw Error(
        `Registrant not provided for '${NotificationEventType.PLATFORM_USER_REMOVED}' event`
      );
    }

    const registrantProfileURL = this.alkemioUrlGenerator.createUserURL(
      registrant.nameID
    );
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(
        recipient.nameID
      );
    const hubURL = this.alkemioUrlGenerator.createPlatformURL();
    return {
      emailFrom: 'info@alkem.io',
      registrant: {
        name: registrant.displayName,
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
        url: hubURL,
      },
    };
  }
}
