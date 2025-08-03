import { Injectable } from '@nestjs/common';
import { PlatformUser, User } from '@core/models';
import { INotificationBuilder } from '@src/services/domain/builders/notification.builder.interface';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunicationCommunityLeadsMessageEmailPayload } from '@common/email-template-payload';
import {
  CommunicationCommunityLeadsMessageEventPayload,
  InAppNotificationCategory,
  InAppNotificationPayloadBase,
  NotificationEventType,
} from '@alkemio/notifications-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { AlkemioClientAdapter } from '@src/services/application/alkemio-client-adapter';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import { EventRecipientsSet } from '@src/core/models/EvenRecipientsSet';

@Injectable()
export class CommunicationCommunityLeadsMessageNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly alkemioClientAdapter: AlkemioClientAdapter
  ) {}

  public async getEventRecipientSets(
    payload: CommunicationCommunityLeadsMessageEventPayload
  ): Promise<EventRecipientsSet[]> {
    const communityLeadsMessageRecipients =
      await this.alkemioClientAdapter.getRecipients(
        UserNotificationEvent.SpaceCommunicationUpdates,
        payload.space.id,
        payload.triggeredBy
      );
    const sender = communityLeadsMessageRecipients.triggeredBy;

    const communityLeadsMessageAdminRecipients =
      await this.alkemioClientAdapter.getRecipients(
        UserNotificationEvent.SpaceCommunicationUpdatesAdmin,
        payload.space.id,
        payload.triggeredBy
      );

    const emailRecipientsSets: EventRecipientsSet[] = [
      {
        emailRecipients: communityLeadsMessageRecipients.emailRecipients,
        inAppRecipients: communityLeadsMessageRecipients.inAppRecipients,
        emailTemplate:
          EmailTemplate.COMMUNICATION_COMMUNITY_LEADS_MESSAGE_SENDER,
        subjectUser: sender,
      },

      {
        emailRecipients: communityLeadsMessageAdminRecipients.emailRecipients,
        inAppRecipients: communityLeadsMessageAdminRecipients.inAppRecipients,
        emailTemplate:
          EmailTemplate.COMMUNICATION_COMMUNITY_LEADS_MESSAGE_RECIPIENT,
        subjectUser: sender,
      },
    ];
    return emailRecipientsSets;
  }

  public createEmailTemplatePayload(
    eventPayload: CommunicationCommunityLeadsMessageEventPayload,
    recipient: User | PlatformUser,
    sender?: User
  ): CommunicationCommunityLeadsMessageEmailPayload {
    if (!sender) {
      throw Error(
        `Sender not provided for '${NotificationEventType.COMMUNICATION_COMMUNITY_MESSAGE}' event`
      );
    }
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);

    return {
      messageSender: {
        displayName: sender.profile.displayName,
        firstName: sender.firstName,
        email: sender.email,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      message: eventPayload.message,
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
    eventPayload: CommunicationCommunityLeadsMessageEventPayload,
    category: InAppNotificationCategory,
    receiverIDs: string[]
  ): InAppNotificationPayloadBase {
    return {
      type: NotificationEventType.COMMUNICATION_COMMUNITY_MESSAGE,
      triggeredAt: new Date(),
      category,
      triggeredByID: eventPayload.triggeredBy,
      receiverIDs,
    };
  }
}
