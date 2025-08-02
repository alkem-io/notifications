import { Injectable } from '@nestjs/common';
import {
  NotificationEventType,
  CommunicationCommunityLeadsMessageEventPayload,
} from '@alkemio/notifications-lib';
import { PlatformUser, User } from '@core/models';
import { INotificationBuilder } from '@core/contracts/notification.builder.interface';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunicationCommunityLeadsMessageEmailPayload } from '@common/email-template-payload';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { AlkemioClientAdapter } from '../../../application';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import { EventEmailRecipients } from '@src/core/models/EventEmailRecipients';

@Injectable()
export class CommunicationCommunityLeadsMessageNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly alkemioClientAdapter: AlkemioClientAdapter
  ) {}

  public async getEmailRecipientSets(
    payload: CommunicationCommunityLeadsMessageEventPayload
  ): Promise<EventEmailRecipients[]> {
    const communityLeadsMessageRecipients =
      await this.alkemioClientAdapter.getRecipients(
        UserNotificationEvent.SpaceCommunicationUpdates,
        payload.space.id,
        payload.triggeredBy
      );

    const communityLeadsMessageAdminRecipients =
      await this.alkemioClientAdapter.getRecipients(
        UserNotificationEvent.SpaceCommunicationUpdatesAdmin,
        payload.space.id,
        payload.triggeredBy
      );

    const emailRecipientsSets: EventEmailRecipients[] = [
      {
        emailRecipients: communityLeadsMessageRecipients.emailRecipients,
        emailTemplate:
          EmailTemplate.COMMUNICATION_COMMUNITY_LEADS_MESSAGE_SENDER,
      },

      {
        emailRecipients: communityLeadsMessageAdminRecipients.emailRecipients,
        emailTemplate:
          EmailTemplate.COMMUNICATION_COMMUNITY_LEADS_MESSAGE_RECIPIENT,
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
}
