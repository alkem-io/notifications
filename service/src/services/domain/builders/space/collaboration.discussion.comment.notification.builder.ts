import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '../notification.builder.interface';
import { EmailTemplate } from '@common/enums/email.template';
import { PlatformUser, User } from '@core/models';
import {
  CollaborationDiscussionCommentEventPayload,
  InAppNotificationCategory,
  InAppNotificationPayloadBase,
  NotificationEventType,
} from '@alkemio/notifications-lib';
import { CollaborationDiscussionCommentEmailPayload } from '@src/common/email-template-payload';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { AlkemioClientAdapter } from '@src/services/application/alkemio-client-adapter';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import { EventRecipientsSet } from '@src/core/models/EvenRecipientsSet';

@Injectable()
export class CollaborationDiscussionCommentNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly alkemioClientAdapter: AlkemioClientAdapter
  ) {}

  public async getEventRecipientSets(
    payload: CollaborationDiscussionCommentEventPayload
  ): Promise<EventRecipientsSet[]> {
    const commentRecipients = await this.alkemioClientAdapter.getRecipients(
      UserNotificationEvent.SpacePostCommentCreated,
      payload.space.id,
      payload.triggeredBy
    );

    const emailRecipientsSets: EventRecipientsSet[] = [
      {
        emailRecipients: commentRecipients.emailRecipients,
        inAppRecipients: commentRecipients.inAppRecipients,
        emailTemplate: EmailTemplate.COLLABORATION_DISCUSSION_COMMENT_MEMBER,
      },
    ];
    return emailRecipientsSets;
  }

  createEmailTemplatePayload(
    eventPayload: CollaborationDiscussionCommentEventPayload,
    recipient: User | PlatformUser,
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
      space: {
        displayName: eventPayload.space.profile.displayName,
        level: eventPayload.space.level,
        url: eventPayload.space.profile.url,
      },
      platform: {
        url: eventPayload.platform.url,
      },
      message: eventPayload.comment.message,
    };
    return result;
  }

  public createInAppTemplatePayload(
    eventPayload: CollaborationDiscussionCommentEventPayload,
    category: InAppNotificationCategory,
    receiverIDs: string[]
  ): InAppNotificationPayloadBase {
    const { triggeredBy: triggeredByID } = eventPayload;

    return {
      type: NotificationEventType.COLLABORATION_DISCUSSION_COMMENT,
      triggeredAt: new Date(),
      category,
      triggeredByID,
      receiverIDs,
    };
  }
}
