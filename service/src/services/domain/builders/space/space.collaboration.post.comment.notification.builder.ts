import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '../notification.builder.interface';
import { SpaceCollaborationPostCommentEventPayload } from '@alkemio/notifications-lib';
import { CollaborationPostCommentEmailPayload } from '@common/email-template-payload';
import { EmailTemplate } from '@common/enums/email.template';
import { PlatformUser, User } from '@core/models';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
@Injectable()
export class CollaborationPostCommentNotificationBuilder
  implements INotificationBuilder
{
  constructor(private readonly alkemioUrlGenerator: AlkemioUrlGenerator) {}

  emailTemplate = EmailTemplate.SPACE_COLLABORATION_POST_COMMENT_OWNER;

  createEmailTemplatePayload(
    eventPayload: SpaceCollaborationPostCommentEventPayload,
    recipient: User | PlatformUser,
    commentAuthor?: User
  ): CollaborationPostCommentEmailPayload {
    if (!commentAuthor) {
      throw Error(
        `Comment author not provided for '${eventPayload.eventType}' event`
      );
    }
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);

    return {
      callout: {
        displayName: eventPayload.callout.displayName,
        url: eventPayload.callout.url,
      },
      post: {
        displayName: eventPayload.post.displayName,
        url: eventPayload.post.url,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      createdBy: {
        firstName: commentAuthor.firstName,
        email: commentAuthor.email,
      },
      space: {
        displayName: eventPayload.space.profile.displayName,
        level: eventPayload.space.level,
        url: eventPayload.space.profile.url,
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }
}
