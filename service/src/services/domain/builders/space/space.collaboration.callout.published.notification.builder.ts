import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '../notification.builder.interface';
import { PlatformUser, User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { SpaceCollaborationCalloutPublishedEventPayload } from '@alkemio/notifications-lib';
import { CollaborationCalloutPublishedEmailPayload } from '@common/email-template-payload';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';

@Injectable()
export class SpaceCollaborationCalloutPublishedNotificationBuilder
  implements INotificationBuilder
{
  constructor(private readonly alkemioUrlGenerator: AlkemioUrlGenerator) {}

  emailTemplate = EmailTemplate.SPACE_COLLABORATION_CALLOUT_PUBLISHED_MEMBER;

  createEmailTemplatePayload(
    eventPayload: SpaceCollaborationCalloutPublishedEventPayload,
    recipient: User | PlatformUser,
    creator?: User
  ): CollaborationCalloutPublishedEmailPayload {
    if (!creator) {
      throw Error(`Creator not provided for '${eventPayload.eventType}' event`);
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);

    const calloutURL = eventPayload.callout.url;

    const result: CollaborationCalloutPublishedEmailPayload = {
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      publishedBy: {
        firstName: creator.firstName,
      },
      callout: {
        displayName: eventPayload.callout.displayName,
        url: calloutURL,
        type: eventPayload.callout.type,
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
    return result;
  }
}
