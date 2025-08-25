import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '../notification.builder.interface';
import { PlatformUser, User } from '@core/models';
import { createUserNotificationPreferencesURL } from '@src/core/util/createNotificationUrl';
import { PlatformForumDiscussionCreatedEmailPayload } from '@common/email-template-payload';
import { NotificationEventPayloadPlatformForumDiscussion } from '@alkemio/notifications-lib';
@Injectable()
export class PlatformForumDiscussionCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor() {}

  createEmailTemplatePayload(
    eventPayload: NotificationEventPayloadPlatformForumDiscussion,
    recipient: User | PlatformUser
  ): PlatformForumDiscussionCreatedEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);
    return {
      createdBy: {
        firstName: eventPayload.triggeredBy.firstName,
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
}
