import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '../notification.builder.interface';
import { PlatformUser, User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { CommentReplyEmailPayload } from '@common/email-template-payload';
import { UserCommentReplyEventPayload } from '@alkemio/notifications-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';

@Injectable()
export class UserCommentReplyNotificationBuilder
  implements INotificationBuilder
{
  constructor(private readonly alkemioUrlGenerator: AlkemioUrlGenerator) {}

  emailTemplate = EmailTemplate.USER_COMMENT_REPLY;

  createEmailTemplatePayload(
    eventPayload: UserCommentReplyEventPayload,
    recipient: User | PlatformUser,
    sender?: User
  ): CommentReplyEmailPayload {
    if (!sender) {
      throw Error(`Sender not provided for '${eventPayload.eventType}' event`);
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);

    return {
      reply: {
        message: eventPayload.reply,
        createdBy: sender.profile.displayName,
        createdByUrl: sender.profile.url,
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
