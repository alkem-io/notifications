import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '@core/contracts';
import { PlatformUser, User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunicationUpdateCreatedEmailPayload } from '@common/email-template-payload';
import {
  CommunicationUpdateEventPayload,
  InAppNotificationCategory,
  InAppNotificationPayloadBase,
  NotificationEventType,
} from '@alkemio/notifications-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { AlkemioClientAdapter } from '@src/services/application/alkemio-client-adapter';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import { EventRecipientsSet } from '@src/core/models/EvenRecipientsSet';

@Injectable()
export class CommunicationUpdateCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly alkemioClientAdapter: AlkemioClientAdapter
  ) {}

  public async getEventRecipientSets(
    payload: CommunicationUpdateEventPayload
  ): Promise<EventRecipientsSet[]> {
    const updateRecipients = await this.alkemioClientAdapter.getRecipients(
      UserNotificationEvent.SpaceCommunicationUpdates,
      payload.space.id,
      payload.triggeredBy
    );

    const updateAdminRecipients = await this.alkemioClientAdapter.getRecipients(
      UserNotificationEvent.SpaceCommunicationUpdatesAdmin,
      payload.space.id,
      payload.triggeredBy
    );

    const emailRecipientsSets: EventRecipientsSet[] = [
      {
        emailRecipients: updateRecipients.emailRecipients,
        inAppRecipients: updateRecipients.inAppRecipients,
        emailTemplate: EmailTemplate.COMMUNICATION_UPDATE_MEMBER,
      },
      {
        emailRecipients: updateAdminRecipients.emailRecipients,
        inAppRecipients: updateAdminRecipients.inAppRecipients,
        emailTemplate: EmailTemplate.COMMUNICATION_UPDATE_ADMIN,
      },
    ];
    return emailRecipientsSets;
  }

  createEmailTemplatePayload(
    eventPayload: CommunicationUpdateEventPayload,
    recipient: User | PlatformUser,
    sender?: User
  ): CommunicationUpdateCreatedEmailPayload {
    if (!sender) {
      throw Error(
        `Sender not provided for '${NotificationEventType.COMMUNICATION_UPDATE_SENT}' event`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);

    return {
      sender: {
        firstName: sender.firstName,
      },
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
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }

  createInAppTemplatePayload(
    eventPayload: CommunicationUpdateEventPayload,
    category: InAppNotificationCategory,
    receiverIDs: string[]
  ): InAppNotificationPayloadBase {
    return {
      type: NotificationEventType.COMMUNICATION_UPDATE_SENT,
      triggeredAt: new Date(),
      category,
      triggeredByID: eventPayload.triggeredBy,
      receiverIDs,
    };
  }
}
