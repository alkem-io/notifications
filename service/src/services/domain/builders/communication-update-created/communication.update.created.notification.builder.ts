import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '@core/contracts';
import { PlatformUser, User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunicationUpdateEventPayload } from '@alkemio/notifications-lib';
import { CommunicationUpdateCreatedEmailPayload } from '@common/email-template-payload';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { AlkemioClientAdapter } from '../../../application';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import { EventEmailRecipients } from '@src/core/models/EventEmailRecipients';

@Injectable()
export class CommunicationUpdateCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly alkemioClientAdapter: AlkemioClientAdapter
  ) {}

  public async getEmailRecipientSets(
    payload: CommunicationUpdateEventPayload
  ): Promise<EventEmailRecipients[]> {
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

    const emailRecipientsSets: EventEmailRecipients[] = [
      {
        emailRecipients: updateRecipients.emailRecipients,
        emailTemplate: EmailTemplate.COMMUNICATION_UPDATE_MEMBER,
      },
      {
        emailRecipients: updateAdminRecipients.emailRecipients,
        emailTemplate: EmailTemplate.COMMUNICATION_UPDATE_ADMIN,
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
    };
  }
}
