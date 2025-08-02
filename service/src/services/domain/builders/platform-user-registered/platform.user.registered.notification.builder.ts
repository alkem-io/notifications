import { Injectable } from '@nestjs/common';
import { PlatformUser, User } from '@core/models';
import { INotificationBuilder } from '@core/contracts/notification.builder.interface';
import { EmailTemplate } from '@common/enums/email.template';
import { PlatformUserRegisteredEmailPayload } from '@common/email-template-payload';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { AlkemioClientAdapter } from '../../../application';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import {
  PlatformUserRegistrationEventPayload,
  InAppNotificationCategory,
  InAppNotificationPayloadBase,
  NotificationEventType,
} from '@alkemio/notifications-lib';
import { EventRecipientsSet } from '@src/core/models/EvenRecipientsSet';

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
  ): Promise<EventRecipientsSet[]> {
    const platformAdminRecipients =
      await this.alkemioClientAdapter.getRecipients(
        UserNotificationEvent.PlatformNewUserSignUp,
        '',
        payload.triggeredBy
      );

    const emailRecipientsSets: EventRecipientsSet[] = [
      {
        emailRecipients: platformAdminRecipients.emailRecipients,
        inAppRecipients: platformAdminRecipients.inAppRecipients,
        emailTemplate: EmailTemplate.PLATFORM_USER_REGISTRATION_ADMIN,
      },
    ];
    if (platformAdminRecipients.triggeredBy) {
      emailRecipientsSets.push({
        emailRecipients: [platformAdminRecipients.triggeredBy],
        inAppRecipients: [platformAdminRecipients.triggeredBy],
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

  createInAppTemplatePayload(
    eventPayload: PlatformUserRegistrationEventPayload,
    category: InAppNotificationCategory,
    receiverIDs: string[]
  ): InAppNotificationPayloadBase {
    return {
      type: NotificationEventType.PLATFORM_USER_REGISTERED,
      triggeredAt: new Date(),
      receiverIDs,
      category,
      triggeredByID: eventPayload.triggeredBy,
      receiverID: receiverIDs[0], // For individual notifications
    };
  }
}
