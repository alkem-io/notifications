import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '@core/contracts';
import { PlatformUser, User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import {
  CollaborationCalloutPublishedEventPayload,
  CompressedInAppNotificationPayload,
  InAppNotificationCalloutPublishedPayload,
  InAppNotificationCategory,
  InAppNotificationPayloadBase,
} from '@alkemio/notifications-lib';
import { CollaborationCalloutPublishedEmailPayload } from '@common/email-template-payload';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { AlkemioClientAdapter } from '../../../application';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import { EventEmailRecipients } from '@src/core/models/EventEmailRecipients';

@Injectable()
export class CollaborationCalloutPublishedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly alkemioClientAdapter: AlkemioClientAdapter
  ) {}

  public async getEmailRecipientSets(
    payload: CollaborationCalloutPublishedEventPayload
  ): Promise<EventEmailRecipients[]> {
    const calloutPublishedRecipients =
      await this.alkemioClientAdapter.getRecipients(
        UserNotificationEvent.SpaceCalloutPublished,
        payload.space.id,
        payload.triggeredBy
      );

    const emailRecipientsSets: EventEmailRecipients[] = [
      {
        emailRecipients: calloutPublishedRecipients.emailRecipients,
        emailTemplate: EmailTemplate.COLLABORATION_CALLOUT_PUBLISHED_MEMBER,
      },
    ];
    return emailRecipientsSets;
  }

  createEmailTemplatePayload(
    eventPayload: CollaborationCalloutPublishedEventPayload,
    recipient: User | PlatformUser,
    creator?: User
  ): CollaborationCalloutPublishedEmailPayload {
    if (!creator) {
      throw Error(
        `Creator not provided for '${NotificationEventType.COLLABORATION_CALLOUT_PUBLISHED} event'`
      );
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

  public createInAppNotificationPayload(
    category: InAppNotificationCategory,
    receiverIDs: string[],
    event: CollaborationCalloutPublishedEventPayload
  ): InAppNotificationPayloadBase {
    const {
      callout: { id: calloutID },
      space: { id: spaceID },
      triggeredBy: triggeredByID,
    } = event;

    return {
      type: NotificationEventType.COLLABORATION_CALLOUT_PUBLISHED,
      triggeredAt: new Date(),
      receiverIDs,
      category,
      calloutID,
      spaceID,
      triggeredByID,
      receiverID: '',
    };
  }
}
