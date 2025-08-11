import { Injectable } from '@nestjs/common';
import { PlatformUser, User } from '@core/models';
import { INotificationBuilder } from '@src/services/domain/builders/notification.builder.interface';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunicationUserMessageEmailPayload } from '@common/email-template-payload';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { UserMessageEventPayload } from '@alkemio/notifications-lib';

@Injectable()
export class UserMessageRecipientNotificationBuilder
  implements INotificationBuilder
{
  constructor(private readonly alkemioUrlGenerator: AlkemioUrlGenerator) {}

  emailTemplate = EmailTemplate.USER_MESSAGE_RECIPIENT;

  public createEmailTemplatePayload(
    eventPayload: UserMessageEventPayload,
    recipient: User | PlatformUser,
    sender?: User
  ): CommunicationUserMessageEmailPayload {
    if (!sender) {
      throw Error(`Sender not provided for '${eventPayload.eventType}' event`);
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
        displayName: eventPayload.user.profile.displayName,
      },
    };
  }
}
