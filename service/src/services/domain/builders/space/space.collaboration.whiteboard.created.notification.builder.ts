import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '../notification.builder.interface';
import { PlatformUser, User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { CollaborationWhiteboardCreatedEmailPayload } from '@common/email-template-payload';
import { SpaceCollaborationWhiteboardCreatedEventPayload } from '@alkemio/notifications-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';

@Injectable()
export class SpaceCollaborationWhiteboardCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(private readonly alkemioUrlGenerator: AlkemioUrlGenerator) {}

  emailTemplate = EmailTemplate.SPACE_COLLABORATION_WHITEBOARD_CREATED_MEMBER;

  createEmailTemplatePayload(
    eventPayload: SpaceCollaborationWhiteboardCreatedEventPayload,
    recipient: User | PlatformUser,
    creator?: User
  ): CollaborationWhiteboardCreatedEmailPayload {
    if (!creator) {
      throw Error(`Creator not provided for '${eventPayload.eventType}' event`);
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);

    return {
      createdBy: {
        firstName: creator.firstName,
        email: creator.email,
      },
      callout: {
        displayName: eventPayload.callout.displayName,
        url: eventPayload.callout.url,
      },
      whiteboard: {
        displayName: eventPayload.whiteboard.displayName,
        url: eventPayload.whiteboard.url,
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
