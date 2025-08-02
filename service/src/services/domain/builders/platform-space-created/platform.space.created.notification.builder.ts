import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '@core/contracts';
import { EmailTemplate } from '@src/common/enums/email.template';
import { PlatformUser, User } from '@src/core/models';
import { SpaceCreatedEmailPayload } from '@src/common/email-template-payload';
import { AlkemioClientAdapter } from '@src/services/application/alkemio-client-adapter';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import {
  SpaceCreatedEventPayload,
  InAppNotificationCategory,
  InAppNotificationPayloadBase,
  NotificationEventType,
} from '@alkemio/notifications-lib';
import { EventRecipientsSet } from '@src/core/models/EvenRecipientsSet';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';

@Injectable()
export class PlatformSpaceCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly alkemioClientAdapter: AlkemioClientAdapter
  ) {}

  public async getEventRecipientSets(
    payload: SpaceCreatedEventPayload
  ): Promise<EventRecipientsSet[]> {
    const spaceCreatedRecipients =
      await this.alkemioClientAdapter.getRecipients(
        UserNotificationEvent.PlatformSpaceCreated,
        '',
        payload.triggeredBy
      );

    const emailRecipientsSets: EventRecipientsSet[] = [
      {
        emailRecipients: spaceCreatedRecipients.emailRecipients,
        inAppRecipients: spaceCreatedRecipients.inAppRecipients,
        emailTemplate: EmailTemplate.PLATFORM_SPACE_CREATED_ADMIN,
      },
    ];
    return emailRecipientsSets;
  }

  createEmailTemplatePayload(
    eventPayload: SpaceCreatedEventPayload,
    recipient: User | PlatformUser
  ): SpaceCreatedEmailPayload {
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);

    return {
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      space: {
        displayName: eventPayload.space.profile.displayName,
        level: eventPayload.space.level,
        url: eventPayload.space.profile.url,
      },
      sender: eventPayload.sender,
      dateCreated: new Date(eventPayload.created).toLocaleString('en-GB', {
        timeZone: 'UTC',
      }),
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }

  createInAppTemplatePayload(
    eventPayload: SpaceCreatedEventPayload,
    category: InAppNotificationCategory,
    receiverID: string
  ): InAppNotificationPayloadBase {
    return {
      type: NotificationEventType.SPACE_CREATED,
      triggeredAt: new Date(),
      category,
      triggeredByID: eventPayload.triggeredBy,
      receiverID,
    };
  }
}
