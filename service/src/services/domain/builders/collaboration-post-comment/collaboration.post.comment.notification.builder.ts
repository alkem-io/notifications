import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '@core/contracts';
import {
  CollaborationPostCommentEventPayload,
  InAppNotificationCategory,
  InAppNotificationPayloadBase,
  NotificationEventType,
} from '@alkemio/notifications-lib';
import { CollaborationPostCommentEmailPayload } from '@common/email-template-payload';
import { EmailTemplate } from '@common/enums/email.template';
import { PlatformUser, User } from '@core/models';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { AlkemioClientAdapter } from '@src/services/application/alkemio-client-adapter';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import { EventRecipientsSet } from '@src/core/models/EvenRecipientsSet';

@Injectable()
export class CollaborationPostCommentNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly alkemioClientAdapter: AlkemioClientAdapter
  ) {}

  public async getEventRecipientSets(
    payload: CollaborationPostCommentEventPayload
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
        emailTemplate: EmailTemplate.COLLABORATION_POST_COMMENT_OWNER,
      },
    ];
    return emailRecipientsSets;
  }

  createEmailTemplatePayload(
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
        level: eventPayload.space.level,
        url: eventPayload.space.profile.url,
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }

  public createInAppTemplatePayload(
    eventPayload: CollaborationPostCommentEventPayload,
    category: InAppNotificationCategory,
    receiverIDs: string[]
  ): InAppNotificationPayloadBase {
    const { triggeredBy: triggeredByID } = eventPayload;

    return {
      type: NotificationEventType.COLLABORATION_POST_COMMENT,
      triggeredAt: new Date(),
      receiverIDs,
      category,
      triggeredByID,
      receiverID: '',
    };
  }
}
