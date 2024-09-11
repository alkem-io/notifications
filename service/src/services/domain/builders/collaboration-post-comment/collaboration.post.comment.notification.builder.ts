import { Injectable } from '@nestjs/common';
import { UserPreferenceType } from '@alkemio/client-lib';
import { INotificationBuilder } from '@core/contracts';
import { CollaborationPostCommentEventPayload } from '@alkemio/notifications-lib';
import { CollaborationPostCommentEmailPayload } from '@common/email-template-payload';
import { NotificationBuilder, RoleConfig } from '@src/services/application';
import { NotificationTemplateType } from '@src/types';
import { EmailTemplate } from '@common/enums/email.template';
import { PlatformUser, User } from '@core/models';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';

@Injectable()
export class CollaborationPostCommentNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly notificationBuilder: NotificationBuilder<
      CollaborationPostCommentEventPayload,
      CollaborationPostCommentEmailPayload
    >,
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator
  ) {}
  build(
    payload: CollaborationPostCommentEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'owner',
        preferenceType: UserPreferenceType.NotificationPostCommentCreated,
        emailTemplate: EmailTemplate.COLLABORATION_POST_COMMENT_OWNER,
      },
    ];

    const templateVariables = {
      ownerID: payload.post.createdBy,
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.comment.createdBy,
      roleConfig,
      templateType: 'collaboration_post_comment',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  createTemplatePayload(
    eventPayload: CollaborationPostCommentEventPayload,
    recipient: User | PlatformUser,
    commentAuthor?: User
  ): CollaborationPostCommentEmailPayload {
    if (!commentAuthor) {
      throw Error(
        `Comment author not provided for '${NotificationEventType.COLLABORATION_POST_COMMENT} event'`
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
        type: eventPayload.space.type,
        url: eventPayload.space.profile.url,
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }
}
