import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '../notification.builder.interface';
import { NotificationEventPayloadSpaceCollaborationCallout } from '@alkemio/notifications-lib';
import { CollaborationPostCommentEmailPayload } from '@common/email-template-payload';
import { EmailTemplate } from '@common/enums/email.template';
import { createUserNotificationPreferencesURL } from '@src/core/util/createNotificationUrl';
import { User } from '@core/models';
import { EventPayloadNotProvidedException } from '@src/common/exceptions/event.payload.not.provided.exception';
import { LogContext } from '@src/common/enums/logging.context';
@Injectable()
export class SpaceCollaborationPostCommentNotificationBuilder
  implements INotificationBuilder
{
  constructor() {}

  emailTemplate =
    EmailTemplate.SPACE_COLLABORATION_CALLOUT_POST_CONTRIBUTION_COMMENT;

  createEmailTemplatePayload(
    eventPayload: NotificationEventPayloadSpaceCollaborationCallout,
    recipient: User
  ): CollaborationPostCommentEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);
    const callout = eventPayload.callout;

    const contribution = eventPayload.callout.contribution;
    if (!contribution) {
      throw new EventPayloadNotProvidedException(
        'Contribution not found',
        LogContext.NOTIFICATION_BUILDER
      );
    }
    return {
      callout: {
        displayName: callout.framing.displayName,
        url: callout.framing.url,
      },
      post: {
        displayName: contribution.displayName,
        url: contribution.url,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      createdBy: {
        firstName: eventPayload.triggeredBy.firstName,
        email: eventPayload.triggeredBy.email,
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
