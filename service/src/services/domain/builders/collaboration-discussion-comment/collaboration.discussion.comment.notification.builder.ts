import { Injectable } from '@nestjs/common';
import { UserPreferenceType } from '@alkemio/client-lib';
import { INotificationBuilder } from '@core/contracts';
import { NotificationBuilder, RoleConfig } from '@src/services/application';
import { NotificationTemplateType } from '@src/types';
import { EmailTemplate } from '@common/enums/email.template';
import { ExternalUser, User } from '@core/models';
import {
  CollaborationDiscussionCommentEventPayload,
  NotificationEventType,
} from '@alkemio/notifications-lib';
import { CollaborationDiscussionCommentEmailPayload } from '@src/common/email-template-payload';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';

@Injectable()
export class CollaborationDiscussionCommentNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<
      CollaborationDiscussionCommentEventPayload,
      CollaborationDiscussionCommentEmailPayload
    >
  ) {}

  build(
    payload: CollaborationDiscussionCommentEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'member',
        preferenceType: UserPreferenceType.NotificationDiscussionCommentCreated,
        emailTemplate: EmailTemplate.COLLABORATION_DISCUSSION_COMMENT_MEMBER,
      },
    ];

    const templateVariables = {
      spaceID: payload.space.id,
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.comment.createdBy,
      roleConfig,
      templateType: 'collaboration_discussion_comment',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  createTemplatePayload(
    eventPayload: CollaborationDiscussionCommentEventPayload,
    recipient: User | ExternalUser,
    commentAuthor?: User
  ): CollaborationDiscussionCommentEmailPayload {
    if (!commentAuthor) {
      throw Error(
        `Comment author not provided for '${NotificationEventType.COLLABORATION_DISCUSSION_COMMENT} event'`
      );
    }
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);

    const result: CollaborationDiscussionCommentEmailPayload = {
      emailFrom: 'info@alkem.io',
      callout: {
        displayName: eventPayload.callout.displayName,
        url: eventPayload.callout.url,
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
      journey: {
        displayName: eventPayload.space.profile.displayName,
        type: eventPayload.space.type,
        url: eventPayload.space.profile.url,
      },
      platform: {
        url: eventPayload.platform.url,
      },
      message: eventPayload.comment.message,
    };
    return result;
  }
}
