import { Injectable } from '@nestjs/common';
import { UserPreferenceType } from '@alkemio/client-lib';
import { INotificationBuilder } from '@core/contracts';
import { User } from '@core/models';
import { NotificationBuilder, RoleConfig } from '../../../application';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunityCollaborationInterestPayload } from '@common/dto';
import { NotificationTemplateType } from '@src/types';
import { COMMUNITY_COLLABORATION_INTEREST } from '@src/common';

@Injectable()
export class CommunityCollaborationInterestNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly notificationBuilder: NotificationBuilder<CommunityCollaborationInterestPayload>
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
  ) {
    if (!user) {
      throw Error(
        `Interested user not provided for '${COMMUNITY_COLLABORATION_INTEREST} event'`
      );
    }

    return {
      emailFrom: 'info@alkem.io',
      user: {
        name: user.displayName,
        email: user.email,
      },
      recipient: {
        firstname: recipient.firstName,
        email: recipient.email,
      },

      opportunity: {
        nameID: eventPayload.opportunity.nameID,
      },
    };
  }
}
