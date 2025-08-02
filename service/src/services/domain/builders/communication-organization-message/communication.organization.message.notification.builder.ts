import { Injectable } from '@nestjs/common';
import {
  NotificationEventType,
  CommunicationOrganizationMessageEventPayload,
} from '@alkemio/notifications-lib';
import { PlatformUser, User } from '@core/models';
import { INotificationBuilder } from '@core/contracts/notification.builder.interface';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunicationOrganizationMessageEmailPayload } from '@common/email-template-payload';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { AlkemioClientAdapter } from '../../../application';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import { EventEmailRecipients } from '@src/core/models/EventEmailRecipients';

@Injectable()
export class CommunicationOrganizationMessageNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly alkemioClientAdapter: AlkemioClientAdapter
  ) {}

  public async getEmailRecipientSets(
    payload: CommunicationOrganizationMessageEventPayload
  ): Promise<EventEmailRecipients[]> {
    const organizationMessageRecipients =
      await this.alkemioClientAdapter.getRecipients(
        UserNotificationEvent.OrganizationMessageReceived,
        payload.organization.id,
        payload.triggeredBy
      );

    const emailRecipientsSets: EventEmailRecipients[] = [
      {
        emailRecipients: organizationMessageRecipients.emailRecipients,
        emailTemplate:
          EmailTemplate.COMMUNICATION_ORGANIZATION_MESSAGE_RECIPIENT,
      },
    ];
    if (organizationMessageRecipients.triggeredBy) {
      emailRecipientsSets.push({
        emailRecipients: [organizationMessageRecipients.triggeredBy],
        emailTemplate: EmailTemplate.COMMUNICATION_ORGANIZATION_MESSAGE_SENDER,
      });
    }
    return emailRecipientsSets;
  }

  public createEmailTemplatePayload(
    eventPayload: CommunicationOrganizationMessageEventPayload,
    recipient: User | PlatformUser,
    sender?: User
  ): CommunicationOrganizationMessageEmailPayload {
    if (!sender) {
      throw Error(
        `Sender not provided for '${NotificationEventType.COMMUNICATION_ORGANIZATION_MESSAGE}' event`
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
      organization: {
        displayName: eventPayload.organization.profile.displayName,
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }
}
