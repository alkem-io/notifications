import { Injectable } from '@nestjs/common';
import { PlatformUser, User } from '@core/models';
import { INotificationBuilder } from '@core/contracts/notification.builder.interface';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunicationOrganizationMessageEmailPayload } from '@common/email-template-payload';
import {
  CommunicationOrganizationMessageEventPayload,
  InAppNotificationCategory,
  InAppNotificationPayloadBase,
  NotificationEventType,
} from '@alkemio/notifications-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { AlkemioClientAdapter } from '@src/services/application/alkemio-client-adapter';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import { EventRecipientsSet } from '@src/core/models/EvenRecipientsSet';

@Injectable()
export class OrganizationMessageNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly alkemioClientAdapter: AlkemioClientAdapter
  ) {}

  public async getEventRecipientSets(
    payload: CommunicationOrganizationMessageEventPayload
  ): Promise<EventRecipientsSet[]> {
    const organizationMessageRecipients =
      await this.alkemioClientAdapter.getRecipients(
        UserNotificationEvent.OrganizationMessageReceived,
        payload.organization.id,
        payload.triggeredBy
      );

    const emailRecipientsSets: EventRecipientsSet[] = [
      {
        emailRecipients: organizationMessageRecipients.emailRecipients,
        inAppRecipients: organizationMessageRecipients.inAppRecipients,
        emailTemplate:
          EmailTemplate.ORGANIZATION_MESSAGE_RECIPIENT,
      },
    ];
    if (organizationMessageRecipients.triggeredBy) {
      emailRecipientsSets.push({
        emailRecipients: [organizationMessageRecipients.triggeredBy],
        inAppRecipients: organizationMessageRecipients.inAppRecipients,
        emailTemplate: EmailTemplate.ORGANIZATION_MESSAGE_SENDER,
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

  createInAppTemplatePayload(
    eventPayload: CommunicationOrganizationMessageEventPayload,
    category: InAppNotificationCategory,
    receiverID: string
  ): InAppNotificationPayloadBase {
    return {
      type: NotificationEventType.COMMUNICATION_ORGANIZATION_MESSAGE,
      triggeredAt: new Date(),
      category,
      triggeredByID: eventPayload.triggeredBy,
      receiverID,
    };
  }
}
