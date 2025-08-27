import { Injectable } from '@nestjs/common';
import { PlatformUser, User } from '@core/models';
import { INotificationBuilder } from '@src/services/domain/builders/notification.builder.interface';
import { createUserNotificationPreferencesURL } from '@src/core/util/createNotificationUrl';
import { CommunicationUserMessageEmailPayload } from '@common/email-template-payload';
import { NotificationEventPayloadUserMessageDirect } from '@alkemio/notifications-lib';

@Injectable()
export class UserMessageRecipientNotificationBuilder
  implements INotificationBuilder
{
  constructor() {}

  public createEmailTemplatePayload(
    eventPayload: NotificationEventPayloadUserMessageDirect,
    recipient: User | PlatformUser
  ): CommunicationUserMessageEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);

    return {
      messageSender: {
        displayName: eventPayload.triggeredBy.profile.displayName,
        firstName: eventPayload.triggeredBy.firstName,
        email: eventPayload.triggeredBy.email,
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
        firstName: eventPayload.user.firstName,
      },
    };
  }
}
