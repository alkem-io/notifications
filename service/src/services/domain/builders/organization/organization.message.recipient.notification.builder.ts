import { Injectable } from '@nestjs/common';
import { PlatformUser, User } from '@core/models';
import { INotificationBuilder } from '@src/services/domain/builders/notification.builder.interface';
import { EmailTemplate } from '@common/enums/email.template';
import { createUserNotificationPreferencesURL } from '@src/core/util/createNotificationUrl';
import { CommunicationOrganizationMessageEmailPayload } from '@common/email-template-payload';
import { NotificationEventPayloadOrganizationMessageDirect } from '@alkemio/notifications-lib';

@Injectable()
export class OrganizationMessageRecipientNotificationBuilder
  implements INotificationBuilder
{
  constructor() {}

  emailTemplate = EmailTemplate.ORGANIZATION_MESSAGE_RECIPIENT;

  public createEmailTemplatePayload(
    eventPayload: NotificationEventPayloadOrganizationMessageDirect,
    recipient: User | PlatformUser
  ): CommunicationOrganizationMessageEmailPayload {
    const notificationPreferenceURL =
      createUserNotificationPreferencesURL(recipient);

    return {
      messageSender: {
        displayName: eventPayload.triggeredBy.profile.displayName,
        firstName: eventPayload.triggeredBy.firstName,
        email: eventPayload.triggeredBy.email,
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
