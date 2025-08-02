import { Injectable } from '@nestjs/common';
import { PlatformUser, User } from '@core/models';
import { INotificationBuilder } from '@core/contracts/notification.builder.interface';
import { EmailTemplate } from '@common/enums/email.template';
import { PlatformUserRemovedEmailPayload } from '@src/common/email-template-payload/platform.user.removed.email.payload';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { AlkemioClientAdapter } from '@src/services/application/alkemio-client-adapter';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import {
  PlatformUserRemovedEventPayload,
  InAppNotificationCategory,
  InAppNotificationPayloadBase,
  NotificationEventType,
} from '@alkemio/notifications-lib';
import { EventRecipientsSet } from '@src/core/models/EvenRecipientsSet';

@Injectable()
export class PlatformUserRemovedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly alkemioClientAdapter: AlkemioClientAdapter
  ) {}

  public async getEventRecipientSets(
    payload: PlatformUserRemovedEventPayload
  ): Promise<EventRecipientsSet[]> {
    const platformAdminRecipients =
      await this.alkemioClientAdapter.getRecipients(
        UserNotificationEvent.PlatformUserProfileRemoved,
        '',
        payload.triggeredBy
      );

    const emailRecipientsSets: EventRecipientsSet[] = [
      {
        emailRecipients: platformAdminRecipients.emailRecipients,
        inAppRecipients: platformAdminRecipients.inAppRecipients,
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

  createInAppTemplatePayload(
    eventPayload: PlatformUserRemovedEventPayload,
    category: InAppNotificationCategory,
    receiverID: string
  ): InAppNotificationPayloadBase {
    return {
      type: NotificationEventType.PLATFORM_USER_REMOVED,
      triggeredAt: new Date(),
      category,
      triggeredByID: eventPayload.triggeredBy,
      receiverID,
    };
  }
}
