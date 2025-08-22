import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '../notification.builder.interface';
import { User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { createUserNotificationPreferencesURL } from '@src/core/util/createNotificationUrl';
import { CommunicationUpdateCreatedEmailPayload } from '@common/email-template-payload';
import { NotificationEventPayloadSpaceCommunicationUpdate } from '@alkemio/notifications-lib';
import { convertMarkdownToHtml } from '@src/utils/markdown-to-html.util';

@Injectable()
export class SpaceCommunicationUpdateAdminNotificationBuilder
  implements INotificationBuilder
{
  constructor() {}

  emailTemplate = EmailTemplate.SPACE_COMMUNICATION_UPDATE_ADMIN;

  createEmailTemplatePayload(
    eventPayload: NotificationEventPayloadSpaceCommunicationUpdate,
    recipient: User
  ): CommunicationUpdateCreatedEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);

    return {
      sender: {
        firstName: eventPayload.triggeredBy.firstName,
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
      message: convertMarkdownToHtml(eventPayload.message ?? ''),
    };
  }
}
