import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '@core/contracts';
import { PlatformUser, User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { CommentReplyEventPayload } from '@alkemio/notifications-lib';
import { UserPreferenceType } from '@alkemio/client-lib';
import { NotificationBuilder, RoleConfig } from '../../../application';
import { NotificationTemplateType } from '@src/types';
import { CommentReplyEmailPayload } from '@common/email-template-payload';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';

@Injectable()
export class CommentReplyNotificationBuilder implements INotificationBuilder {
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<
      CommentReplyEventPayload,
      CommentReplyEmailPayload
    >
  ) {}

  build(
    payload: CommentReplyEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'commentOwner',
        emailTemplate: EmailTemplate.COMMENT_REPLY,
        preferenceType: UserPreferenceType.NotificationCommentReply,
      },
    ];

    const templateVariables = {
      senderID: payload.triggeredBy,
      commentOwnerID: payload.comment.commentOwnerId,
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.triggeredBy,
      roleConfig,
      templateVariables,
      templateType: 'comment_reply',
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  createTemplatePayload(
    eventPayload: CommentReplyEventPayload,
    recipient: User | PlatformUser,
    sender?: User
  ): CommentReplyEmailPayload {
    if (!sender) {
      throw Error(
        `Sender not provided for '${NotificationEventType.COMMENT_REPLY}' event`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);

    return {
      emailFrom: 'info@alkem.io',
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
