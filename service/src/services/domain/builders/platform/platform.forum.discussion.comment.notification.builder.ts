import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '../notification.builder.interface';
import { PlatformUser, User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { PlatformForumDiscussionCommentEventPayload } from '@alkemio/notifications-lib';
import { PlatformForumDiscussionCommentEmailPayload } from '@common/email-template-payload';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { AlkemioClientAdapter } from '@src/services/application/alkemio-client-adapter';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import { EventRecipientsSet } from '@src/core/models/EvenRecipientsSet';
import {
  InAppNotificationCategory,
  InAppNotificationEventType,
} from '@src/generated/graphql';
import { InAppNotificationPayloadBase } from '@src/types/in-app';
@Injectable()
export class PlatformForumDiscussionCommentNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly alkemioClientAdapter: AlkemioClientAdapter
  ) {}

  public async getEventRecipientSets(
    payload: PlatformForumDiscussionCommentEventPayload
  ): Promise<EventRecipientsSet[]> {
    const forumDiscussionCommentRecipients =
      await this.alkemioClientAdapter.getRecipients(
        UserNotificationEvent.PlatformForumDiscussionComment,
        undefined,
        payload.triggeredBy
      );
    const sender = await this.alkemioClientAdapter.getUser(
      payload.comment.createdBy
    );

    const emailRecipientsSets: EventRecipientsSet[] = [
      {
        emailRecipients: forumDiscussionCommentRecipients.emailRecipients,
        inAppRecipients: forumDiscussionCommentRecipients.inAppRecipients,
        emailTemplate: EmailTemplate.PLATFORM_FORUM_DISCUSSION_COMMENT,
        subjectUser: sender,
      },
    ];
    return emailRecipientsSets;
  }

  createEmailTemplatePayload(
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

  createInAppTemplatePayload(
    eventPayload: PlatformForumDiscussionCommentEventPayload,
    category: InAppNotificationCategory,
    receiverIDs: string[]
  ): InAppNotificationPayloadBase {
    return {
      type: InAppNotificationEventType.PlatformForumDiscussionComment,
      triggeredAt: new Date(),
      category,
      triggeredByID: eventPayload.triggeredBy,
      receiverIDs,
    };
  }
}
