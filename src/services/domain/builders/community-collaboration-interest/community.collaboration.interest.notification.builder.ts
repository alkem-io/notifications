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
import { CommunityCollaborationInterestPayload } from '@common/dto';
import { NotificationTemplateType } from '@src/types';
import {
  ALKEMIO_URL_GENERATOR,
  COMMUNITY_COLLABORATION_INTEREST,
} from '@src/common';
import { CommunityCollaborationInterestEmailPayload } from '@common/email-template-payload';

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
      opportunityID: payload.opportunity.id,
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
        `Interested user not provided for '${COMMUNITY_COLLABORATION_INTEREST} event'`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(
        recipient.nameID
      );

    const hubURL = this.alkemioUrlGenerator.createHubURL();

    return {
      emailFrom: 'info@alkem.io',
      user: {
        name: user.displayName,
        email: user.email,
      },
      recipient: {
        firstname: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      opportunity: {
        name: eventPayload.opportunity.name,
      },
      hub: {
        url: hubURL,
      },
      relation: {
        role: eventPayload.relation.role,
        description: eventPayload.relation.description,
      },
    };
  }
}
