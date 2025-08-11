import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '../notification.builder.interface';
import { PlatformUser, User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { PlatformForumDiscussionCreatedEmailPayload } from '@common/email-template-payload';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { PlatformForumDiscussionCreatedEventPayload } from '@alkemio/notifications-lib';
@Injectable()
export class PlatformForumDiscussionCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(private readonly alkemioUrlGenerator: AlkemioUrlGenerator) {}

  emailTemplate = EmailTemplate.PLATFORM_FORUM_DISCUSSION_CREATED;

  createEmailTemplatePayload(
    eventPayload: PlatformForumDiscussionCreatedEventPayload,
    recipient: User | PlatformUser,
    sender?: User
  ): PlatformForumDiscussionCreatedEmailPayload {
    if (!sender) {
      throw Error(`Sender not provided for '${eventPayload.eventType}' event`);
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);
    return {
      createdBy: {
        firstName: sender.firstName,
      },
      discussion: {
        displayName: eventPayload.discussion.displayName,
        url: eventPayload.discussion.url,
      },
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
