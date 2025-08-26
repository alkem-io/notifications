import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '../notification.builder.interface';
import { User } from '@core/models';
import { createUserNotificationPreferencesURL } from '@src/core/util/createNotificationUrl';
import { SpaceCollaborationCalloutCommentEmailPayload } from '@common/email-template-payload';
import { NotificationEventPayloadSpaceCollaborationCallout } from '@alkemio/notifications-lib';
import { normalizeCalloutType } from '@src/utils/callout.util';

@Injectable()
export class SpaceCollaborationCalloutCommentNotificationBuilder
  implements INotificationBuilder
{
  constructor() {}

  createEmailTemplatePayload(
    eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    recipient: User
  ): SpaceCollaborationCalloutCommentEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);

    return {
      createdBy: {
        firstName: eventPayload.triggeredBy.firstName,
        email: eventPayload.triggeredBy.email,
      },
      callout: {
        displayName: eventPayload.callout.framing.displayName,
        url: eventPayload.callout.framing.url,
        type: normalizeCalloutType(eventPayload.callout.framing.type),
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
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
}
