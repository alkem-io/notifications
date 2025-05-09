import { Injectable } from '@nestjs/common';
import {
  NotificationEventType,
  CommunicationOrganizationMessageEventPayload,
} from '@alkemio/notifications-lib';
import { PlatformUser, User } from '@core/models';
import { INotificationBuilder } from '@core/contracts/notification.builder.interface';
import { NotificationBuilder, RoleConfig } from '../../../application';
import { EmailTemplate } from '@common/enums/email.template';
import { NotificationTemplateType } from '@src/types/notification.template.type';
import { CommunicationOrganizationMessageEmailPayload } from '@common/email-template-payload';
import { PreferenceType } from '@alkemio/client-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';

@Injectable()
export class CommunicationOrganizationMessageNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<
      CommunicationOrganizationMessageEventPayload,
      CommunicationOrganizationMessageEmailPayload
    >
  ) {}

  build(
    payload: CommunicationOrganizationMessageEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'receiver',
        emailTemplate:
          EmailTemplate.COMMUNICATION_ORGANIZATION_MESSAGE_RECIPIENT,
        preferenceType: PreferenceType.NotificationOrganizationMessage,
      },
      {
        role: 'sender',
        emailTemplate: EmailTemplate.COMMUNICATION_ORGANIZATION_MESSAGE_SENDER,
      },
    ];

    const templateVariables = {
      senderID: payload.triggeredBy,
      organizationID: payload.organization.id,
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.triggeredBy,
      roleConfig,
      templateType: 'communication_organization_message',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  private createTemplatePayload(
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
