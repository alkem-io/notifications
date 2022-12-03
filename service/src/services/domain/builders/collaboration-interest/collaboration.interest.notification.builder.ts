import { Inject, Injectable } from '@nestjs/common';
import { UserPreferenceType } from '@alkemio/client-lib';
import { INotificationBuilder } from '@core/contracts';
import { User } from '@core/models';
import {
  AlkemioUrlGenerator,
  NotificationBuilder,
  RoleConfig,
} from '../../../application';
import { EmailTemplate } from '@common/enums/email.template';
import { CollaborationInterestPayload } from '@alkemio/notifications-lib';
import { NotificationTemplateType } from '@src/types';
import { ALKEMIO_URL_GENERATOR } from '@common/enums';
import { CollaborationInterestEmailPayload } from '@common/email-template-payload';
import { NotificationEventType } from '@alkemio/notifications-lib';

@Injectable()
export class CollaborationInterestNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    @Inject(ALKEMIO_URL_GENERATOR)
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<
      CollaborationInterestPayload,
      CollaborationInterestEmailPayload
    >
  ) {}

  build(
    payload: CollaborationInterestPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'admin',
        preferenceType:
          UserPreferenceType.NotificationCommunityCollaborationInterestAdmin,
        emailTemplate: EmailTemplate.COLLABORATION_INTEREST_ADMIN,
      },
      {
        role: 'user',
        preferenceType:
          UserPreferenceType.NotificationCommunityCollaborationInterestUser,
        emailTemplate: EmailTemplate.COLLABORATION_INTEREST_USER,
      },
    ];

    const templateVariables = {
      userID: payload.triggeredBy,
      hubID: payload.journey.hubID,
      challengeID: payload.journey.challenge?.id ?? '',
      opportunityID: payload.journey.challenge?.opportunity?.id ?? '',
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.triggeredBy,
      roleConfig,
      templateType: 'collaboration_interest',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  private createTemplatePayload(
    eventPayload: CollaborationInterestPayload,
    recipient: User,
    user?: User
  ): CollaborationInterestEmailPayload {
    if (!user) {
      throw Error(
        `Interested user not provided for '${NotificationEventType.COLLABORATION_INTEREST} event'`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(
        recipient.nameID
      );

    const hubURL = this.alkemioUrlGenerator.createPlatformURL();

    return {
      emailFrom: 'info@alkem.io',
      user: {
        name: user.displayName,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      relation: {
        role: eventPayload.relation.role,
        description: eventPayload.relation.description,
      },
      journey: {
        displayName: eventPayload.journey.displayName,
        type: eventPayload.journey.type,
        url: this.alkemioUrlGenerator.createJourneyURL(eventPayload.journey),
      },
      platform: {
        url: hubURL,
      },
    };
  }
}
