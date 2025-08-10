import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '../notification.builder.interface';
import { PlatformUser, User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { CollaborationWhiteboardCreatedEmailPayload } from '@common/email-template-payload';
import {
  CollaborationWhiteboardCreatedEventPayload,
  NotificationEventType,
} from '@alkemio/notifications-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { AlkemioClientAdapter } from '@src/services/application/alkemio-client-adapter';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import { EventRecipientsSet } from '@src/core/models/EvenRecipientsSet';
import {
  InAppNotificationCategory,
  InAppNotificationEventType,
} from '@src/generated/graphql';
import { InAppNotificationPayloadBase } from '@src/types/in-app';
@Injectable()
export class CollaborationWhiteboardCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly alkemioClientAdapter: AlkemioClientAdapter
  ) {}

  public async getEventRecipientSets(
    payload: CollaborationWhiteboardCreatedEventPayload
  ): Promise<EventRecipientsSet[]> {
    const whiteboardCreatedRecipients =
      await this.alkemioClientAdapter.getRecipients(
        UserNotificationEvent.SpaceWhiteboardCreated,
        payload.space.id,
        payload.triggeredBy
      );
    const creator = await this.alkemioClientAdapter.getUser(
      payload.whiteboard.createdBy
    );

    const emailRecipientsSets: EventRecipientsSet[] = [
      {
        emailRecipients: whiteboardCreatedRecipients.emailRecipients,
        inAppRecipients: whiteboardCreatedRecipients.inAppRecipients,
        emailTemplate: EmailTemplate.COLLABORATION_WHITEBOARD_CREATED_MEMBER,
        subjectUser: creator,
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

  createInAppTemplatePayload(
    eventPayload: CollaborationWhiteboardCreatedEventPayload,
    category: InAppNotificationCategory,
    receiverIDs: string[]
  ): InAppNotificationPayloadBase {
    return {
      type: InAppNotificationEventType.CollaborationWhiteboardCreated,
      triggeredAt: new Date(),
      category,
      triggeredByID: eventPayload.whiteboard.createdBy,
      receiverIDs,
    };
  }
}
