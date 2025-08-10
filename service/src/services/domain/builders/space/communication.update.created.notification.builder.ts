import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '../notification.builder.interface';
import { PlatformUser, User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunicationUpdateCreatedEmailPayload } from '@common/email-template-payload';
import {
  CommunicationUpdateEventPayload,
  NotificationEventType,
} from '@alkemio/notifications-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { AlkemioClientAdapter } from '@src/services/application/alkemio-client-adapter';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import { EventRecipientsSet } from '@src/core/models/EvenRecipientsSet';
import { convertMarkdownToHtml } from '@src/utils/markdown-to-html.util';
import {
  InAppNotificationCategory,
  InAppNotificationEventType,
} from '@src/generated/graphql';
import { InAppNotificationPayloadBase } from '@src/types/in-app';
@Injectable()
export class CommunicationUpdateCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly alkemioClientAdapter: AlkemioClientAdapter
  ) {}

  public async getEventRecipientSets(
    payload: CommunicationUpdateEventPayload
  ): Promise<EventRecipientsSet[]> {
    const updateRecipients = await this.alkemioClientAdapter.getRecipients(
      UserNotificationEvent.SpaceCommunicationUpdates,
      payload.space.id,
      payload.triggeredBy
    );

    const updateAdminRecipients = await this.alkemioClientAdapter.getRecipients(
      UserNotificationEvent.SpaceCommunicationUpdatesAdmin,
      payload.space.id,
      payload.triggeredBy
    );

    const emailRecipientsSets: EventRecipientsSet[] = [
      {
        emailRecipients: updateRecipients.emailRecipients,
        inAppRecipients: updateRecipients.inAppRecipients,
        emailTemplate: EmailTemplate.COMMUNICATION_UPDATE_MEMBER,
        subjectUser: updateRecipients.triggeredBy,
      },
      {
        emailRecipients: updateAdminRecipients.emailRecipients,
        inAppRecipients: updateAdminRecipients.inAppRecipients,
        emailTemplate: EmailTemplate.COMMUNICATION_UPDATE_ADMIN,
        subjectUser: updateAdminRecipients.triggeredBy,
      },
    ];
    return emailRecipientsSets;
  }

  createEmailTemplatePayload(
    eventPayload: CommunicationUpdateEventPayload,
    recipient: User | PlatformUser,
    sender?: User
  ): CommunicationUpdateCreatedEmailPayload {
    if (!sender) {
      throw Error(
        `Sender not provided for '${NotificationEventType.COMMUNICATION_UPDATE_SENT}' event`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);

    return {
      sender: {
        firstName: sender.firstName,
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

  createInAppTemplatePayload(
    eventPayload: CommunicationUpdateEventPayload,
    category: InAppNotificationCategory,
    receiverIDs: string[]
  ): InAppNotificationPayloadBase {
    return {
      type: InAppNotificationEventType.CommunicationUpdateSent,
      triggeredAt: new Date(),
      category,
      triggeredByID: eventPayload.triggeredBy,
      receiverIDs,
    };
  }
}
