import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '../notification.builder.interface';
import { User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { createUserNotificationPreferencesURL } from '@src/core/util/createNotificationUrl';
import { CollaborationWhiteboardCreatedEmailPayload } from '@common/email-template-payload';
import { NotificationEventPayloadSpaceCollaborationCallout } from '@alkemio/notifications-lib';
import { EventPayloadNotProvidedException } from '@src/common/exceptions/event.payload.not.provided.exception';
import { LogContext } from '@src/common/enums';

@Injectable()
export class SpaceCollaborationCalloutCommentNotificationBuilder
  implements INotificationBuilder
{
  constructor() {}

  emailTemplate = EmailTemplate.SPACE_COLLABORATION_CALLOUT_COMMENT;

  createEmailTemplatePayload(
    eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    recipient: User
  ): CollaborationWhiteboardCreatedEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);

    const contribution = eventPayload.callout.contribution;
    if (!contribution) {
      throw new EventPayloadNotProvidedException(
        'Contribution not found',
        LogContext.NOTIFICATION_BUILDER
      );
    }
    return {
      createdBy: {
        firstName: eventPayload.triggeredBy.firstName,
        email: eventPayload.triggeredBy.email,
      },
      callout: {
        displayName: eventPayload.callout.framing.displayName,
        url: eventPayload.callout.framing.url,
      },
      whiteboard: {
        displayName: contribution.displayName,
        url: contribution.url,
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
