import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '@core/contracts';
import { PlatformUser, User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { PlatformForumDiscussionCommentEventPayload } from '@alkemio/notifications-lib';
import { PreferenceType } from '@alkemio/client-lib';
import { NotificationBuilder, RoleConfig } from '../../../application';
import { NotificationTemplateType } from '@src/types';
import { PlatformForumDiscussionCommentEmailPayload } from '@common/email-template-payload';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';

@Injectable()
export class PlatformForumDiscussionCommentNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<
      PlatformForumDiscussionCommentEventPayload,
      PlatformForumDiscussionCommentEmailPayload
    >
  ) {}

  build(
    payload: PlatformForumDiscussionCommentEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'discussionCreator',
        emailTemplate: EmailTemplate.PLATFORM_FORUM_DISCUSSION_COMMENT,
        preferenceType: PreferenceType.NotificationForumDiscussionComment,
      },
    ];

    const templateVariables = {
      discussionCreatorID: payload.discussion.createdBy,
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.discussion.createdBy,
      roleConfig,
      templateType: 'platform_forum_discussion_comment',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  createTemplatePayload(
    eventPayload: PlatformForumDiscussionCommentEventPayload,
    recipient: User | PlatformUser,
    sender?: User
  ): PlatformForumDiscussionCommentEmailPayload {
    if (!sender) {
      throw Error(
        `Sender not provided for '${NotificationEventType.PLATFORM_FORUM_DISCUSSION_COMMENT}' event`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);
    return {
      comment: eventPayload.comment,
      discussion: eventPayload.discussion,
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
