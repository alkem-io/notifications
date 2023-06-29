import { Inject, Injectable } from '@nestjs/common';
import { PlatformUserRemovedEventPayload } from '@alkemio/notifications-lib';
import { ExternalUser, User } from '@core/models';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator';
import { INotificationBuilder } from '@core/contracts/notification.builder.interface';
import { NotificationBuilder, RoleConfig } from '../../../application';
import { UserPreferenceType } from '@alkemio/client-lib';
import { EmailTemplate } from '@common/enums/email.template';
import { NotificationTemplateType } from '@src/types/notification.template.type';
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
      PlatformUserRemovedEmailPayload
    >
  ) {}

  build(
    payload: PlatformUserRemovedEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'admin',
        emailTemplate: EmailTemplate.PLATFORM_USER_REMOVED_ADMIN,
        preferenceType: UserPreferenceType.NotificationUserRemoved,
      },
    ];

    const templateVariables = { registrantID: payload.triggeredBy };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.triggeredBy,
      roleConfig,
      templateType: 'platform_user_removed',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  private createTemplatePayload(
    eventPayload: PlatformUserRemovedEventPayload,
    recipient: User | ExternalUser
  ): PlatformUserRemovedEmailPayload {
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);
    return {
      emailFrom: 'info@alkem.io',
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
        url: this.alkemioUrlGenerator.createPlatformURL(),
      },
    };
  }
}
