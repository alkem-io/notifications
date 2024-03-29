import { Injectable, Inject } from '@nestjs/common';
import { ALKEMIO_URL_GENERATOR } from '@common/enums';
import { INotificationBuilder } from '@core/contracts';
import { ExternalUser, User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { CommentReplyEventPayload } from '@alkemio/notifications-lib';
import { UserPreferenceType } from '@alkemio/client-lib';
import {
  AlkemioUrlGenerator,
  NotificationBuilder,
  RoleConfig,
} from '../../../application';
import { NotificationTemplateType } from '@src/types';
import { CommentReplyEmailPayload } from '@common/email-template-payload';
import { NotificationEventType } from '@alkemio/notifications-lib';

@Injectable()
export class CommentReplyNotificationBuilder implements INotificationBuilder {
  constructor(
    @Inject(ALKEMIO_URL_GENERATOR)
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
    recipient: User | ExternalUser,
    sender?: User
  ): CommentReplyEmailPayload {
    if (!sender) {
      throw Error(
        `Sender not provided for '${NotificationEventType.COMMENT_REPLY}' event`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);
    const alkemioURL = this.alkemioUrlGenerator.createPlatformURL();
    return {
      emailFrom: 'info@alkem.io',
      reply: {
        message: eventPayload.reply,
        createdBy: sender.profile.displayName,
        createdByUrl: this.alkemioUrlGenerator.createUserURL(sender.nameID),
      },
      comment: eventPayload.comment,
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      platform: {
        url: alkemioURL,
      },
    };
  }
}
