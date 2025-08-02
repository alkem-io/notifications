import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '@core/contracts';
import { PlatformUser, User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { CommentReplyEventPayload } from '@alkemio/notifications-lib';
import { CommentReplyEmailPayload } from '@common/email-template-payload';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { AlkemioClientAdapter } from '../../../application';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import { EventEmailRecipients } from '@src/core/models/EventEmailRecipients';

@Injectable()
export class CommentReplyNotificationBuilder implements INotificationBuilder {
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly alkemioClientAdapter: AlkemioClientAdapter
  ) {}

  public async getEmailRecipientSets(
    payload: CommentReplyEventPayload
  ): Promise<EventEmailRecipients[]> {
    const commentReplyRecipients =
      await this.alkemioClientAdapter.getRecipients(
        UserNotificationEvent.SpaceCommentReply,
        undefined, // Comment reply doesn't have space ID directly
        payload.triggeredBy
      );

    const emailRecipientsSets: EventEmailRecipients[] = [
      {
        emailRecipients: commentReplyRecipients.emailRecipients,
        emailTemplate: EmailTemplate.COMMENT_REPLY,
      },
    ];
    return emailRecipientsSets;
  }

  createEmailTemplatePayload(
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
