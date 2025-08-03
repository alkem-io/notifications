import { Injectable } from '@nestjs/common';
import { PlatformUser, User } from '@core/models';
import { INotificationBuilder } from '@src/services/domain/builders/notification.builder.interface';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunicationUserMessageEmailPayload } from '@common/email-template-payload';
import {
  UserMessageEventPayload,
  InAppNotificationCategory,
  InAppNotificationPayloadBase,
  NotificationEventType,
} from '@alkemio/notifications-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { AlkemioClientAdapter } from '@src/services/application/alkemio-client-adapter';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import { EventRecipientsSet } from '@src/core/models/EvenRecipientsSet';

@Injectable()
export class UserMessageNotificationBuilder implements INotificationBuilder {
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly alkemioClientAdapter: AlkemioClientAdapter
  ) {}

  public async getEventRecipientSets(
    payload: UserMessageEventPayload
  ): Promise<EventRecipientsSet[]> {
    const userMessageRecipients = await this.alkemioClientAdapter.getRecipients(
      UserNotificationEvent.OrganizationMessageReceived,
      undefined,
      payload.triggeredBy
    );

    const emailRecipientsSets: EventRecipientsSet[] = [
      {
        emailRecipients: userMessageRecipients.emailRecipients,
        inAppRecipients: userMessageRecipients.inAppRecipients,
        emailTemplate: EmailTemplate.USER_MESSAGE_RECIPIENT,
        subjectUser: userMessageRecipients.triggeredBy,
      },
    ];

    // Add sender notification if available
    if (userMessageRecipients.triggeredBy) {
      emailRecipientsSets.push({
        emailRecipients: [userMessageRecipients.triggeredBy],
        inAppRecipients: [userMessageRecipients.triggeredBy],
        emailTemplate: EmailTemplate.USER_MESSAGE_SENDER,
        subjectUser: userMessageRecipients.triggeredBy,
      });
    }

    return emailRecipientsSets;
  }

  public createEmailTemplatePayload(
    eventPayload: UserMessageEventPayload,
    recipient: User | PlatformUser,
    sender?: User
  ): CommunicationUserMessageEmailPayload {
    if (!sender) {
      throw Error(
        `Sender not provided for '${NotificationEventType.USER_MESSAGE}' event`
      );
    }
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);

    return {
      messageSender: {
        displayName: sender.profile.displayName,
        firstName: sender.firstName,
        email: sender.email,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      message: eventPayload.message,
      platform: {
        url: eventPayload.platform.url,
      },
      messageReceiver: {
        displayName: eventPayload.messageReceiver.profile.displayName,
      },
    };
  }

  createInAppTemplatePayload(
    eventPayload: UserMessageEventPayload,
    category: InAppNotificationCategory,
    receiverIDs: string[]
  ): InAppNotificationPayloadBase {
    return {
      type: NotificationEventType.USER_MESSAGE,
      triggeredAt: new Date(),
      category,
      triggeredByID: eventPayload.triggeredBy,
      receiverIDs,
    };
  }
}
