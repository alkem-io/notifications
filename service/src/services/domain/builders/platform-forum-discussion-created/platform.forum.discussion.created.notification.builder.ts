import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '@core/contracts';
import { PlatformUser, User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { PlatformForumDiscussionCreatedEmailPayload } from '@common/email-template-payload';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { AlkemioClientAdapter } from '@src/services/application/alkemio-client-adapter';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import {
  PlatformForumDiscussionCreatedEventPayload,
  InAppNotificationCategory,
  InAppNotificationPayloadBase,
  NotificationEventType,
} from '@alkemio/notifications-lib';
import { EventRecipientsSet } from '@src/core/models/EvenRecipientsSet';

@Injectable()
export class PlatformForumDiscussionCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly alkemioClientAdapter: AlkemioClientAdapter
  ) {}

  public async getEventRecipientSets(
    payload: PlatformForumDiscussionCreatedEventPayload
  ): Promise<EventRecipientsSet[]> {
    const platformUsersRecipients =
      await this.alkemioClientAdapter.getRecipients(
        UserNotificationEvent.PlatformForumDiscussionCreated,
        '',
        payload.triggeredBy
      );

    const emailRecipientsSets: EventRecipientsSet[] = [
      {
        emailRecipients: platformUsersRecipients.emailRecipients,
        inAppRecipients: platformUsersRecipients.inAppRecipients,
        emailTemplate: EmailTemplate.PLATFORM_FORUM_DISCUSSION_CREATED,
      },
    ];
    return emailRecipientsSets;
  }

  createEmailTemplatePayload(
    eventPayload: PlatformForumDiscussionCreatedEventPayload,
    recipient: User | PlatformUser,
    sender?: User
  ): PlatformForumDiscussionCreatedEmailPayload {
    if (!sender) {
      throw Error(
        `Sender not provided for '${NotificationEventType.PLATFORM_FORUM_DISCUSSION_CREATED}' event`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);
    return {
      createdBy: {
        firstName: sender.firstName,
      },
      discussion: {
        displayName: eventPayload.discussion.displayName,
        url: eventPayload.discussion.url,
      },
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
    eventPayload: PlatformForumDiscussionCreatedEventPayload,
    category: InAppNotificationCategory,
    receiverIDs: string[]
  ): InAppNotificationPayloadBase {
    return {
      type: NotificationEventType.PLATFORM_FORUM_DISCUSSION_CREATED,
      triggeredAt: new Date(),
      receiverIDs,
      category,
      triggeredByID: eventPayload.triggeredBy,
      receiverID: receiverIDs[0], // For individual notifications
    };
  }
}
