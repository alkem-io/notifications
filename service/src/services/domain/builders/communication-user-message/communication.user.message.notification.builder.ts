import { Injectable } from '@nestjs/common';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { PlatformUser, User } from '@core/models';
import { CommunicationUserMessageEventPayload } from '@alkemio/notifications-lib';
import { INotificationBuilder } from '@core/contracts/notification.builder.interface';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunicationUserMessageEmailPayload } from '@common/email-template-payload';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { AlkemioClientAdapter } from '../../../application';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import { EventEmailRecipients } from '@src/core/models/EventEmailRecipients';

@Injectable()
export class CommunicationUserMessageNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly alkemioClientAdapter: AlkemioClientAdapter
  ) {}

  public async getEmailRecipientSets(
    payload: CommunicationUserMessageEventPayload
  ): Promise<EventEmailRecipients[]> {
    const userMessageRecipients = await this.alkemioClientAdapter.getRecipients(
      UserNotificationEvent.OrganizationMessageReceived,
      undefined, // User message doesn't have organization/space ID directly
      payload.triggeredBy
    );

    const emailRecipientsSets: EventEmailRecipients[] = [
      {
        emailRecipients: userMessageRecipients.emailRecipients,
        emailTemplate: EmailTemplate.COMMUNICATION_USER_MESSAGE_RECIPIENT,
      },
    ];

    // Add sender notification if available
    if (userMessageRecipients.triggeredBy) {
      emailRecipientsSets.push({
        emailRecipients: [userMessageRecipients.triggeredBy],
        emailTemplate: EmailTemplate.COMMUNICATION_USER_MESSAGE_SENDER,
      });
    }

    return emailRecipientsSets;
  }

  public createEmailTemplatePayload(
    eventPayload: CommunicationUserMessageEventPayload,
    recipient: User | PlatformUser,
    sender?: User
  ): CommunicationUserMessageEmailPayload {
    if (!sender) {
      throw Error(
        `Sender not provided for '${NotificationEventType.COMMUNICATION_USER_MESSAGE}' event`
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
}
