import { Injectable } from '@nestjs/common';
import { PlatformUser, User } from '@core/models';
import { INotificationBuilder } from '@src/services/domain/builders/notification.builder.interface';
import { createUserNotificationPreferencesURL } from '@src/core/util/createNotificationUrl';
import { CommunicationUserMentionEmailPayload } from '@common/email-template-payload';
import { convertMarkdownToText } from '@src/utils/markdown-to-text.util';
import { NotificationEventPayloadUserMessageRoom } from '@alkemio/notifications-lib';

@Injectable()
export class UserMentionNotificationBuilder implements INotificationBuilder {
  constructor() {}

  public createEmailTemplatePayload(
    eventPayload: NotificationEventPayloadUserMessageRoom,
    recipient: User | PlatformUser
  ): CommunicationUserMentionEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);

    const htmlComment: string = convertMarkdownToText(eventPayload.comment);

    return {
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      commentSender: {
        displayName: eventPayload.triggeredBy.profile.displayName,
        firstName: eventPayload.triggeredBy.firstName,
      },
      comment: htmlComment,
      platform: {
        url: eventPayload.platform.url,
      },
      commentOrigin: {
        url: eventPayload.commentOrigin.url,
        displayName: eventPayload.commentOrigin.displayName,
      },
    };
  }
}
