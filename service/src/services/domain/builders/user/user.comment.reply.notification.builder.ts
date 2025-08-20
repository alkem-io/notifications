import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '../notification.builder.interface';
import { PlatformUser, User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { CommentReplyEmailPayload } from '@common/email-template-payload';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { NotificationEventPayloadUserMessageRoomReply } from '@alkemio/notifications-lib';

@Injectable()
export class UserCommentReplyNotificationBuilder
  implements INotificationBuilder
{
  constructor(private readonly alkemioUrlGenerator: AlkemioUrlGenerator) {}

  emailTemplate = EmailTemplate.USER_COMMENT_REPLY;

  createEmailTemplatePayload(
    eventPayload: NotificationEventPayloadUserMessageRoomReply,
    recipient: User | PlatformUser
  ): CommentReplyEmailPayload {
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);

    return {
      reply: {
        message: eventPayload.reply,
        createdBy: eventPayload.triggeredBy.profile.displayName,
        createdByUrl: eventPayload.triggeredBy.profile.url,
      },
      comment: eventPayload.comment,
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
