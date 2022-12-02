import { Inject, Injectable } from '@nestjs/common';
import { INotificationBuilder } from '@core/contracts';
import { CollaborationCardCreatedEventPayload } from '@alkemio/notifications-lib';
import { UserPreferenceType } from '@alkemio/client-lib';
import {
  AlkemioUrlGenerator,
  NotificationBuilder,
  RoleConfig,
} from '@src/services/application';
import { NotificationTemplateType } from '@src/types';
import { User } from '@core/models';
import { ALKEMIO_URL_GENERATOR } from '@common/enums';
import { EmailTemplate } from '@common/enums/email.template';
import { CollaborationCardCreatedEmailPayload } from '@common/email-template-payload';
import { NotificationEventType } from '@alkemio/notifications-lib';

@Injectable()
export class CollaborationCardCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly notificationBuilder: NotificationBuilder<
      CollaborationCardCreatedEventPayload,
      CollaborationCardCreatedEmailPayload
    >,
    @Inject(ALKEMIO_URL_GENERATOR)
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator
  ) {}
  build(
    payload: CollaborationCardCreatedEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'admin',
        preferenceType: UserPreferenceType.NotificationAspectCreatedAdmin,
        emailTemplate: EmailTemplate.COLLABORATION_CARD_CREATED_ADMIN,
      },
      {
        role: 'user',
        preferenceType: UserPreferenceType.NotificationAspectCreated,
        emailTemplate: EmailTemplate.COLLABORATION_CARD_CREATED_MEMBER,
      },
    ];

    const templateVariables = {
      hubID: payload.journey.hubID,
      challengeID: payload.journey?.challenge?.id ?? '',
      opportunityID: payload.journey?.challenge?.opportunity?.id ?? '',
      entityID:
        payload.journey?.challenge?.opportunity?.id ??
        payload.journey?.challenge?.id ??
        payload.journey.hubID,
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.card.createdBy,
      roleConfig,
      templateType: 'collaboration_card_created',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  createTemplatePayload(
    eventPayload: CollaborationCardCreatedEventPayload,
    recipient: User,
    creator?: User
  ): CollaborationCardCreatedEmailPayload {
    if (!creator) {
      throw Error(
        `Creator not provided for '${NotificationEventType.COLLABORATION_CARD_CREATED} event'`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(
        recipient.nameID
      );

    const hubURL = this.alkemioUrlGenerator.createPlatformURL();

    return {
      emailFrom: 'info@alkem.io',
      createdBy: {
        firstname: creator.firstName,
        email: creator.email,
      },
      card: {
        displayName: eventPayload.card.displayName,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      journey: {
        name: eventPayload.journey.displayName,
        type: eventPayload.journey.type,
        url: this.alkemioUrlGenerator.createJourneyURL(eventPayload.journey),
      },
      platform: {
        url: hubURL,
      },
    };
  }
}
