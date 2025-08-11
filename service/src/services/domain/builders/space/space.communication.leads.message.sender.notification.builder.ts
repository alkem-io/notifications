import { Injectable } from '@nestjs/common';
import { PlatformUser, User } from '@core/models';
import { INotificationBuilder } from '@src/services/domain/builders/notification.builder.interface';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunicationCommunityLeadsMessageEmailPayload } from '@common/email-template-payload';
import { SpaceCommunicationLeadsMessageEventPayload } from '@alkemio/notifications-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';

@Injectable()
export class SpaceCommunicationLeadsMessageSenderNotificationBuilder
  implements INotificationBuilder
{
  constructor(private readonly alkemioUrlGenerator: AlkemioUrlGenerator) {}

  emailTemplate =
    EmailTemplate.SPACE_COMMUNICATION_COMMUNITY_LEADS_MESSAGE_SENDER;

  public createEmailTemplatePayload(
    eventPayload: SpaceCommunicationLeadsMessageEventPayload,
    recipient: User | PlatformUser,
    sender?: User
  ): CommunicationCommunityLeadsMessageEmailPayload {
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
