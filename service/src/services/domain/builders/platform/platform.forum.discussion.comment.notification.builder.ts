import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '../notification.builder.interface';
import { PlatformUser, User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { NotificationEventPayloadPlatformForumDiscussion } from '@alkemio/notifications-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { PlatformForumDiscussionCommentEmailPayload } from '@src/common/email-template-payload/platform.forum.discussion.comment.email.payload';
import { EventPayloadNotProvidedException } from '@src/common/exceptions/event.payload.not.provided.exception';
import { LogContext } from '@src/common/enums';
@Injectable()
export class PlatformForumDiscussionCommentNotificationBuilder
  implements INotificationBuilder
{
  constructor(private readonly alkemioUrlGenerator: AlkemioUrlGenerator) {}

  emailTemplate = EmailTemplate.PLATFORM_FORUM_DISCUSSION_COMMENT;

  createEmailTemplatePayload(
    eventPayload: NotificationEventPayloadPlatformForumDiscussion,
    recipient: User | PlatformUser
  ): PlatformForumDiscussionCommentEmailPayload {
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);
    const comment = eventPayload.comment;
    if (!comment) {
      throw new EventPayloadNotProvidedException(
        `comment missing in payload: ${eventPayload}`,
        LogContext.IN_APP_BUILDER
      );
    }
    const result: PlatformForumDiscussionCommentEmailPayload = {
      comment: {
        createdBy: comment.createdBy.id,
        message: comment.message,
      },
      discussion: {
        displayName: eventPayload.discussion.displayName,
        createdBy: eventPayload.discussion.createdBy.id,
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
    return result;
  }
}
