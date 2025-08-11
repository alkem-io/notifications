import { Injectable } from '@nestjs/common';
import { PlatformUser, User } from '@core/models';
import { UserMentionEventPayload } from '@alkemio/notifications-lib';
import { INotificationBuilder } from '@src/services/domain/builders/notification.builder.interface';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunicationUserMentionEmailPayload } from '@common/email-template-payload';
import { convertMarkdownToText } from '@src/utils/markdown-to-text.util';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';

@Injectable()
export class UserMentionNotificationBuilder implements INotificationBuilder {
  constructor(private readonly alkemioUrlGenerator: AlkemioUrlGenerator) {}

  emailTemplate = EmailTemplate.USER_MENTION;

  public createEmailTemplatePayload(
    eventPayload: UserMentionEventPayload,
    recipient: User | PlatformUser,
    sender?: User
  ): CommunicationUserMentionEmailPayload {
    if (!sender) {
      throw Error(`Sender not provided for '${eventPayload.eventType}' event`);
    }
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);

    const htmlComment: string = convertMarkdownToText(eventPayload.comment);

    return {
      commentSender: {
        displayName: sender.profile.displayName,
        firstName: sender.firstName,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
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
