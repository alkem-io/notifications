import { Injectable } from '@nestjs/common';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { ExternalUser, User } from '@core/models';
import { INotificationBuilder } from '@core/contracts/notification.builder.interface';
import { NotificationBuilder, RoleConfig } from '../../../application';
import { UserPreferenceType } from '@alkemio/client-lib';
import { EmailTemplate } from '@common/enums/email.template';
import { NotificationTemplateType } from '@src/types/notification.template.type';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { PlatformGlobalRoleChangeEmailPayload } from '@src/common/email-template-payload/platform.global.role.change.email.payload';
import { PlatformGlobalRoleChangeEventPayload } from '@alkemio/notifications-lib';

@Injectable()
export class PlatformGlobalRoleChangeNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<
      PlatformGlobalRoleChangeEventPayload,
      PlatformGlobalRoleChangeEmailPayload
    >
  ) {}

  build(
    payload: PlatformGlobalRoleChangeEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'admin',
        emailTemplate: EmailTemplate.PLATFORM_GLOBAL_ROLE_CHANGE_ADMIN,
        preferenceType: UserPreferenceType.NotificationUserSignUp,
      },
    ];

    const templateVariables = { registrantID: payload.user.id };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.user.id,
      roleConfig,
      templateType: 'platform_global_role_change',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  private createTemplatePayload(
    eventPayload: PlatformGlobalRoleChangeEventPayload,
    recipient: User | ExternalUser,
    user?: User
  ): PlatformGlobalRoleChangeEmailPayload {
    if (!user) {
      throw Error(
        `User not provided for '${NotificationEventType.PLATFORM_GLOBAL_ROLE_CHANGE}' event`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);
    return {
      emailFrom: 'info@alkem.io',
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
      triggeredBy: eventPayload.triggeredBy,
    };
  }
}
