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
import { CommunityCollaborationInterestPayload } from '@alkemio/notifications-lib';
import { NotificationTemplateType } from '@src/types';
import { ALKEMIO_URL_GENERATOR } from '@common/enums';
import { CommunityCollaborationInterestEmailPayload } from '@common/email-template-payload';
import { NotificationEventType } from '@alkemio/notifications-lib';

@Injectable()
export class CommunityCollaborationInterestNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    @Inject(ALKEMIO_URL_GENERATOR)
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<
      CommunityCollaborationInterestPayload,
      CommunityCollaborationInterestEmailPayload
    >
  ) {}

  build(
    payload: CommunityCollaborationInterestPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'admin',
        preferenceType:
          UserPreferenceType.NotificationCommunityCollaborationInterestAdmin,
        emailTemplate: EmailTemplate.COMMUNITY_COLLABORATION_INTEREST_ADMIN,
      },
      {
        role: 'user',
        preferenceType:
          UserPreferenceType.NotificationCommunityCollaborationInterestUser,
        emailTemplate: EmailTemplate.COMMUNITY_COLLABORATION_INTEREST_USER,
      },
    ];

    const templateVariables = {
      userID: payload.userID,
      hubID: payload.hub.id,
      challengeID: payload.hub.challenge?.id ?? '',
      opportunityID: payload.hub.challenge?.opportunity?.id ?? '',
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.userID,
      roleConfig,
      templateType: 'community_collaboration_interest',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  private createTemplatePayload(
    eventPayload: CommunityCollaborationInterestPayload,
    recipient: User,
    user?: User
  ): CommunityCollaborationInterestEmailPayload {
    if (!user) {
      throw Error(
        `Interested user not provided for '${NotificationEventType.COMMUNITY_COLLABORATION_INTEREST} event'`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(
        recipient.nameID
      );

    const hubURL = this.alkemioUrlGenerator.createHubURL();

    const communityURL = this.alkemioUrlGenerator.createCommunityURL(
      eventPayload.hub.nameID,
      eventPayload.hub.challenge?.nameID,
      eventPayload.hub.challenge?.opportunity?.nameID
    );

    return {
      emailFrom: 'info@alkem.io',
      user: {
        name: user.displayName,
      },
      recipient: {
        firstname: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      relation: {
        role: eventPayload.relation.role,
        description: eventPayload.relation.description,
      },
      community: {
        name: eventPayload.community.name,
        type: eventPayload.community.type,
        url: communityURL,
      },
      hub: {
        url: hubURL,
      },
    };
  }
}
