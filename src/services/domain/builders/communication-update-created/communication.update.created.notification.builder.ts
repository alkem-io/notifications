import { Injectable, Inject } from '@nestjs/common';
import { ALKEMIO_URL_GENERATOR, COMMUNICATION_UPDATE_SENT } from '@src/common';
import { INotificationBuilder } from '@core/contracts';
import { User } from '@core/models';
import { EmailTemplate } from '@src/common/enums/email.template';
import { CommunicationUpdateEventPayload } from '@common/dto';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator';
import { UserPreferenceType } from '@alkemio/client-lib';
// todo
import {
  NotificationBuilder,
  RoleConfig,
} from '@src/services/application/notification-builder/notification.builder1';
import { NotificationTemplateType } from '@src/types';

@Injectable()
export class CommunicationUpdateCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    @Inject(ALKEMIO_URL_GENERATOR)
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<CommunicationUpdateEventPayload>
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
  ): any {
    if (!sender) {
      throw Error(
        `Sender not provided for '${COMMUNICATION_UPDATE_SENT}' event`
      );
    }

    const communityURL = this.alkemioUrlGenerator.createCommunityURL(
      eventPayload.hub.nameID,
      eventPayload.hub.challenge?.nameID,
      eventPayload.hub.challenge?.opportunity?.nameID
    );
    const senderProfile = this.alkemioUrlGenerator.createUserURL(sender.nameID);
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(
        recipient.nameID
      );
    const hubURL = this.alkemioUrlGenerator.createHubURL();
    return {
      emailFrom: 'info@alkem.io',
      sender: {
        name: sender.displayName,
        firstname: sender.firstName,
        email: sender.email,
        profile: senderProfile,
      },
      update: {
        id: eventPayload.update.id,
      },
      recipient: {
        name: recipient.displayName,
        firstname: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      community: {
        name: eventPayload.community.name,
        type: eventPayload.community.type,
        url: communityURL,
      },
      hub: {
        url: hubURL,
      },
      event: eventPayload,
    };
  }
}
