import { Injectable } from '@nestjs/common';
import { PlatformUserRemovedEventPayload } from '@alkemio/notifications-lib';
import { PlatformUser, User } from '@core/models';
import { INotificationBuilder } from '@core/contracts/notification.builder.interface';
import { EmailTemplate } from '@common/enums/email.template';
import { PlatformUserRemovedEmailPayload } from '@src/common/email-template-payload/platform.user.removed.email.payload';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { AlkemioClientAdapter } from '../../../application';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import { EventEmailRecipients } from '@src/core/models/EventEmailRecipients';

@Injectable()
export class PlatformUserRemovedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly alkemioClientAdapter: AlkemioClientAdapter
  ) {}

  public async getEmailRecipientSets(
    payload: PlatformUserRemovedEventPayload
  ): Promise<EventEmailRecipients[]> {
    const platformAdminRecipients =
      await this.alkemioClientAdapter.getRecipients(
        UserNotificationEvent.PlatformUserProfileRemoved,
        '',
        payload.triggeredBy
      );

    const emailRecipientsSets: EventEmailRecipients[] = [
      {
        emailRecipients: platformAdminRecipients.emailRecipients,
        emailTemplate: EmailTemplate.PLATFORM_USER_REMOVED_ADMIN,
      },
    ];
    return emailRecipientsSets;
  }

  public createEmailTemplatePayload(
    eventPayload: PlatformUserRemovedEventPayload,
    recipient: User | PlatformUser
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
