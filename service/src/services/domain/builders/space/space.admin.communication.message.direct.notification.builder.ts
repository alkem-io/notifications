import { Injectable } from '@nestjs/common';
import { User } from '@core/models';
import { INotificationBuilder } from '@src/services/domain/builders/notification.builder.interface';
import { createUserNotificationPreferencesURL } from '@src/core/util/createNotificationUrl';
import { SpaceCommunicationMessageDirectEmailPayload } from '@common/email-template-payload';
import { NotificationEventPayloadSpaceCommunicationMessageDirect } from '@alkemio/notifications-lib';

@Injectable()
export class SpaceAdminCommunicationMessageDirectNotificationBuilder
  implements INotificationBuilder
{
  constructor() {}

  public createEmailTemplatePayload(
    eventPayload: NotificationEventPayloadSpaceCommunicationMessageDirect,
    recipient: User
  ): SpaceCommunicationMessageDirectEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);

    return {
      messageSender: {
        displayName: eventPayload.triggeredBy.profile.displayName,
        firstName: eventPayload.triggeredBy.firstName,
        email: eventPayload.triggeredBy.email,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      message: eventPayload.message,
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
}
