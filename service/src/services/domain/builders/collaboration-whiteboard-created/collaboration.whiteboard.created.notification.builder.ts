import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '@core/contracts';
import { CollaborationWhiteboardCreatedEventPayload } from '@alkemio/notifications-lib';
import { PlatformUser, User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { CollaborationWhiteboardCreatedEmailPayload } from '@common/email-template-payload';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { AlkemioClientAdapter } from '../../../application';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import { EventEmailRecipients } from '@src/core/models/EventEmailRecipients';

@Injectable()
export class CollaborationWhiteboardCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly alkemioClientAdapter: AlkemioClientAdapter
  ) {}

  public async getEmailRecipientSets(
    payload: CollaborationWhiteboardCreatedEventPayload
  ): Promise<EventEmailRecipients[]> {
    const whiteboardCreatedRecipients =
      await this.alkemioClientAdapter.getRecipients(
        UserNotificationEvent.SpaceWhiteboardCreated,
        payload.space.id,
        payload.triggeredBy
      );

    const emailRecipientsSets: EventEmailRecipients[] = [
      {
        emailRecipients: whiteboardCreatedRecipients.emailRecipients,
        emailTemplate: EmailTemplate.COLLABORATION_WHITEBOARD_CREATED_MEMBER,
      },
    ];
    return emailRecipientsSets;
  }

  createEmailTemplatePayload(
    eventPayload: CollaborationWhiteboardCreatedEventPayload,
    recipient: User | PlatformUser,
    creator?: User
  ): CollaborationWhiteboardCreatedEmailPayload {
    if (!creator) {
      throw Error(
        `Creator not provided for '${NotificationEventType.COLLABORATION_WHITEBOARD_CREATED} event'`
      );
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
