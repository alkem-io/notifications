import { Injectable } from '@nestjs/common';
import { PlatformUser, User } from '@core/models';
import { INotificationBuilder } from '@src/services/domain/builders/notification.builder.interface';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunicationOrganizationMessageEmailPayload } from '@common/email-template-payload';
import { OrganizationMessageEventPayload } from '@alkemio/notifications-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';

@Injectable()
export class OrganizationMessageRecipientNotificationBuilder
  implements INotificationBuilder
{
  constructor(private readonly alkemioUrlGenerator: AlkemioUrlGenerator) {}

  emailTemplate = EmailTemplate.ORGANIZATION_MESSAGE_SENDER;

  public createEmailTemplatePayload(
    eventPayload: OrganizationMessageEventPayload,
    recipient: User | PlatformUser,
    sender?: User
  ): CommunicationOrganizationMessageEmailPayload {
    if (!sender) {
      throw Error(`Sender not provided for '${eventPayload.eventType}' event`);
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
