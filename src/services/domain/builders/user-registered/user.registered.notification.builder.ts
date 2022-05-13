import { Inject, Injectable } from '@nestjs/common';
import { ALKEMIO_URL_GENERATOR, USER_REGISTERED } from '@src/common';
import { User } from '@core/models';
import { UserRegistrationEventPayload } from '@common/dto';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator';
import { INotificationBuilder } from '@core/contracts/notification.builder.interface';
// todo
import {
  NotificationBuilder,
  RoleConfig,
} from '../../../application/notification-builder/notification.builder1';
import { UserPreferenceType } from '@alkemio/client-lib';
import { EmailTemplate } from '@common/enums/email.template';
import { NotificationTemplateType } from '@src/types/notification.template.type';

@Injectable()
export class UserRegisteredNotificationBuilder implements INotificationBuilder {
  constructor(
    @Inject(ALKEMIO_URL_GENERATOR)
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<UserRegistrationEventPayload>
  ) {}

  build(
    payload: UserRegistrationEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'admin',
        emailTemplate: EmailTemplate.USER_REGISTRATION_ADMIN,
        preferenceType: UserPreferenceType.NotificationUserSignUp,
      },
      {
        role: 'registrant',
        emailTemplate: EmailTemplate.USER_REGISTRATION_REGISTRANT,
      },
    ];

    const templateVariables = { registrantID: payload.userID };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.userID,
      roleConfig,
      templateType: 'user_registered',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  private createTemplatePayload(
    eventPayload: UserRegistrationEventPayload,
    recipient: User,
    registrant?: User
  ): Record<string, unknown> {
    if (!registrant) {
      throw Error(`Registrant not provided for '${USER_REGISTERED}' event`);
    }

    const registrantProfileURL = this.alkemioUrlGenerator.createUserURL(
      registrant.nameID
    );
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(
        recipient.nameID
      );
    const hubURL = this.alkemioUrlGenerator.createHubURL();
    return {
      emailFrom: 'info@alkem.io',
      registrant: {
        name: registrant.displayName,
        firstname: registrant.firstName,
        email: registrant.email,
        profile: registrantProfileURL,
      },
      recipient: {
        name: recipient.displayName,
        firstname: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      hub: {
        url: hubURL,
      },
      event: eventPayload,
    };
  }
}
