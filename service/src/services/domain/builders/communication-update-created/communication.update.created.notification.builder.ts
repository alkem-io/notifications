import { Injectable, Inject } from '@nestjs/common';
import { ALKEMIO_URL_GENERATOR } from '@common/enums';
import { INotificationBuilder } from '@core/contracts';
import { User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunicationUpdateEventPayload } from '@alkemio/notifications-lib/src/dto';
import { UserPreferenceType } from '@alkemio/client-lib';
import {
  AlkemioUrlGenerator,
  NotificationBuilder,
  RoleConfig,
} from '../../../application';
import { NotificationTemplateType } from '@src/types';
import { CommunicationUpdateCreatedEmailPayload } from '@common/email-template-payload';
import { NotificationEventType } from '@alkemio/notifications-lib/src/notification.event.type';

@Injectable()
export class CommunicationUpdateCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    @Inject(ALKEMIO_URL_GENERATOR)
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<
      CommunicationUpdateEventPayload,
      CommunicationUpdateCreatedEmailPayload
    >
  ) {}

  build(
    payload: CommunicationUpdateEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'admin',
        emailTemplate: EmailTemplate.COMMUNICATION_UPDATE_ADMIN,
        preferenceType:
          UserPreferenceType.NotificationCommunicationUpdateSentAdmin,
      },
      {
        role: 'member',
        emailTemplate: EmailTemplate.COMMUNICATION_UPDATE_MEMBER,
        preferenceType: UserPreferenceType.NotificationCommunicationUpdates,
      },
    ];

    const templateVariables = {
      hubID: payload.hub.id,
      challengeID: payload.hub.challenge?.id ?? '',
      opportunityID: payload.hub.challenge?.opportunity?.id ?? '',
      entityID:
        payload.hub?.challenge?.opportunity?.id ??
        payload.hub?.challenge?.id ??
        payload.hub.id,
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.update.createdBy,
      roleConfig,
      templateType: 'communication_update_sent',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  createTemplatePayload(
    eventPayload: CommunicationUpdateEventPayload,
    recipient: User,
    sender?: User
  ): CommunicationUpdateCreatedEmailPayload {
    if (!sender) {
      throw Error(
        `Sender not provided for '${NotificationEventType.COMMUNICATION_UPDATE_SENT}' event`
      );
    }
    const communityURL = this.alkemioUrlGenerator.createCommunityURL(
      eventPayload.hub.nameID,
      eventPayload.hub.challenge?.nameID,
      eventPayload.hub.challenge?.opportunity?.nameID
    );
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(
        recipient.nameID
      );
    const hubURL = this.alkemioUrlGenerator.createHubURL();
    return {
      emailFrom: 'info@alkem.io',
      sender: {
        firstname: sender.firstName,
      },
      recipient: {
        firstname: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      community: {
        name: eventPayload.community.name,
        url: communityURL,
      },
      hub: {
        url: hubURL,
      },
    };
  }
}
