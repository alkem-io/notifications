import { Injectable } from '@nestjs/common';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { PlatformUser, User } from '@core/models';
import { PlatformUserRegistrationEventPayload } from '@alkemio/notifications-lib';
import { INotificationBuilder } from '@core/contracts/notification.builder.interface';
import { EmailTemplate } from '@common/enums/email.template';
import { PlatformUserRegisteredEmailPayload } from '@common/email-template-payload';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { AlkemioClientAdapter } from '../../../application';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import { EventEmailRecipients } from '@src/core/models/EventEmailRecipients';

@Injectable()
export class PlatformUserRegisteredNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly alkemioClientAdapter: AlkemioClientAdapter
  ) {}

  public async getEmailRecipientSets(
    payload: PlatformUserRegistrationEventPayload
  ): Promise<EventEmailRecipients[]> {
    const platformAdminRecipients =
      await this.alkemioClientAdapter.getRecipients(
        UserNotificationEvent.PlatformNewUserSignUp,
        '',
        payload.triggeredBy
      );

    const emailRecipientsSets: EventEmailRecipients[] = [
      {
        emailRecipients: platformAdminRecipients.emailRecipients,
        emailTemplate: EmailTemplate.PLATFORM_USER_REGISTRATION_ADMIN,
      },
    ];
    if (platformAdminRecipients.triggeredBy) {
      emailRecipientsSets.push({
        emailRecipients: [platformAdminRecipients.triggeredBy],
        emailTemplate: EmailTemplate.PLATFORM_USER_REGISTRATION_REGISTRANT,
      });
    }
    return emailRecipientsSets;
  }

  public createEmailTemplatePayload(
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
