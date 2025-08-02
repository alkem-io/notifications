import { Injectable } from '@nestjs/common';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { PlatformUser, User } from '@core/models';
import { CommunicationUserMessageEventPayload } from '@alkemio/notifications-lib';
import { INotificationBuilder } from '@core/contracts/notification.builder.interface';
import { NotificationBuilder, RoleConfig } from '../../../application';
import { EmailTemplate } from '@common/enums/email.template';
import { NotificationTemplateType } from '@src/types/notification.template.type';
import { CommunicationUserMessageEmailPayload } from '@common/email-template-payload';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';

@Injectable()
export class CommunicationUserMessageNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<
      CommunicationUserMessageEventPayload,
      CommunicationUserMessageEmailPayload
    >
  ) {}

  build(
    payload: CommunicationUserMessageEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'receiver',
        emailTemplate: EmailTemplate.COMMUNICATION_USER_MESSAGE_RECIPIENT,
        checkIsUserMessagingAllowed: true,
      },
      {
        role: 'sender',
        emailTemplate: EmailTemplate.COMMUNICATION_USER_MESSAGE_SENDER,
      },
    ];

    const templateVariables = {
      senderID: payload.triggeredBy,
      receiverID: payload.messageReceiver.id,
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.triggeredBy,
      roleConfig,
      templateType: 'communication_user_message',
      templateVariables,
      templatePayloadBuilderFn: this.createEmailTemplatePayload.bind(this),
    });
  }

  private createEmailTemplatePayload(
    eventPayload: CommunicationUserMessageEventPayload,
    recipient: User | PlatformUser,
    sender?: User
  ): CommunicationUserMessageEmailPayload {
    if (!sender) {
      throw Error(
        `Sender not provided for '${NotificationEventType.COMMUNICATION_USER_MESSAGE}' event`
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
      platform: {
        url: eventPayload.platform.url,
      },
      messageReceiver: {
        displayName: eventPayload.messageReceiver.profile.displayName,
      },
    };
  }
}
