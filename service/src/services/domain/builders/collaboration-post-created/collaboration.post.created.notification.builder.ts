import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '@core/contracts';
import { PlatformUser, User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { CollaborationPostCreatedEmailPayload } from '@common/email-template-payload';
import {
  CollaborationPostCreatedEventPayload,
  InAppNotificationCategory,
  InAppNotificationPayloadBase,
  NotificationEventType,
} from '@alkemio/notifications-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { AlkemioClientAdapter } from '@src/services/application/alkemio-client-adapter';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import { EventRecipientsSet } from '@src/core/models/EvenRecipientsSet';

@Injectable()
export class CollaborationPostCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly alkemioClientAdapter: AlkemioClientAdapter
  ) {}

  public async getEventRecipientSets(
    payload: CollaborationPostCreatedEventPayload
  ): Promise<EventRecipientsSet[]> {
    const postCreatedRecipients = await this.alkemioClientAdapter.getRecipients(
      UserNotificationEvent.SpacePostCreated,
      payload.space.id,
      payload.triggeredBy
    );

    const postCreatedAdminRecipients =
      await this.alkemioClientAdapter.getRecipients(
        UserNotificationEvent.SpacePostCreatedAdmin,
        payload.space.id,
        payload.triggeredBy
      );

    const emailRecipientsSets: EventRecipientsSet[] = [
      {
        emailRecipients: postCreatedRecipients.emailRecipients,
        inAppRecipients: postCreatedRecipients.inAppRecipients,
        emailTemplate: EmailTemplate.COLLABORATION_POST_CREATED_MEMBER,
      },
      {
        emailRecipients: postCreatedAdminRecipients.emailRecipients,
        inAppRecipients: postCreatedAdminRecipients.inAppRecipients,
        emailTemplate: EmailTemplate.COLLABORATION_POST_CREATED_ADMIN,
      },
    ];
    return emailRecipientsSets;
  }

  createEmailTemplatePayload(
    eventPayload: CollaborationPostCreatedEventPayload,
    recipient: User | PlatformUser,
    creator?: User
  ): CollaborationPostCreatedEmailPayload {
    if (!creator) {
      throw Error(
        `Creator not provided for '${NotificationEventType.COLLABORATION_POST_CREATED} event'`
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
      post: {
        displayName: eventPayload.post.displayName,
        url: eventPayload.post.url,
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
    eventPayload: CollaborationPostCreatedEventPayload,
    category: InAppNotificationCategory,
    receiverID: string
  ): InAppNotificationPayloadBase {
    return {
      type: NotificationEventType.COLLABORATION_POST_CREATED,
      triggeredAt: new Date(),
      category,
      triggeredByID: eventPayload.post.createdBy,
      receiverID,
    };
  }
}
