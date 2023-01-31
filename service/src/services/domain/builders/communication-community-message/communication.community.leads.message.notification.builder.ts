import { Inject, Injectable } from '@nestjs/common';
import {
  NotificationEventType,
  CommunicationCommunityLeadsMessageEventPayload,
} from '@alkemio/notifications-lib';
import { User } from '@core/models';
import { INotificationBuilder } from '@core/contracts/notification.builder.interface';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator';
import { NotificationBuilder, RoleConfig } from '../../../application';
import { EmailTemplate } from '@common/enums/email.template';
import { NotificationTemplateType } from '@src/types/notification.template.type';
import { CommunicationCommunityLeadsMessageEmailPayload } from '@common/email-template-payload';
import { ALKEMIO_URL_GENERATOR } from '@src/common/enums/providers';

@Injectable()
export class CommunicationCommunityLeadsMessageNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    @Inject(ALKEMIO_URL_GENERATOR)
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<
      CommunicationCommunityLeadsMessageEventPayload,
      CommunicationCommunityLeadsMessageEmailPayload
    >
  ) {}

  build(
    payload: CommunicationCommunityLeadsMessageEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'receiver',
        emailTemplate:
          EmailTemplate.COMMUNICATION_COMMUNITY_LEADS_MESSAGE_RECIPIENT,
      },
      {
        role: 'sender',
        emailTemplate:
          EmailTemplate.COMMUNICATION_COMMUNITY_LEADS_MESSAGE_SENDER,
      },
    ];

    const templateVariables = {
      senderID: payload.triggeredBy,
      journeyID:
        payload.journey?.challenge?.opportunity?.id ??
        payload.journey?.challenge?.id ??
        payload.journey.hubID,
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.messageSender.id,
      roleConfig,
      templateType: 'communication_community_leads_message',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  private createTemplatePayload(
    eventPayload: CommunicationCommunityLeadsMessageEventPayload,
    recipient: User,
    sender?: User
  ): CommunicationCommunityLeadsMessageEmailPayload {
    if (!sender) {
      throw Error(
        `Sender not provided for '${NotificationEventType.COMMUNICATION_COMMUNITY_MESSAGE}' event`
      );
    }
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(
        recipient.nameID
      );
    const alkemioURL = this.alkemioUrlGenerator.createPlatformURL();
    const journeyURL = this.alkemioUrlGenerator.createJourneyURL(
      eventPayload.journey
    );

    return {
      emailFrom: 'info@alkem.io',
      messageSender: {
        displayName: sender.displayName,
        email: sender.email,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      message: eventPayload.message,
      journey: {
        displayName: eventPayload.journey.displayName,
        type: eventPayload.journey.type,
        url: journeyURL,
      },
      platform: {
        url: alkemioURL,
      },
    };
  }
}
