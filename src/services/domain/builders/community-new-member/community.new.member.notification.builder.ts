import { Injectable } from '@nestjs/common';
import { UserPreferenceType } from '@alkemio/client-lib';
import { INotificationBuilder } from '@core/contracts';
import { User } from '@core/models';
// todo
import {
  NotificationBuilder,
  RoleConfig,
} from '@src/services/application/notification-builder/notification.builder1';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunityNewMemberPayload } from '@common/dto';
import { NotificationTemplateType } from '@src/types';
import { COMMUNITY_NEW_MEMBER } from '@src/common';

@Injectable()
export class CommunityNewMemberNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly notificationBuilder: NotificationBuilder<CommunityNewMemberPayload>
  ) {}

  build(
    payload: CommunityNewMemberPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'admin',
        preferenceType: UserPreferenceType.NotificationCommunityNewMemberAdmin,
        emailTemplate: EmailTemplate.COMMUNITY_NEW_MEMBER_ADMIN,
      },
      {
        role: 'member',
        preferenceType: UserPreferenceType.NotificationCommunityNewMember,
        emailTemplate: EmailTemplate.COMMUNITY_NEW_MEMBER_MEMBER,
      },
    ];

    const templateVariables = {
      memberID: payload.userID,
      hubID: payload.hub.id,
      challengeID: payload.hub.challenge?.id ?? '',
      opportunityID: payload.hub.challenge?.opportunity?.id ?? '',
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.userID,
      roleConfig,
      templateType: 'community_new_member',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  private createTemplatePayload(
    eventPayload: CommunityNewMemberPayload,
    recipient: User,
    member?: User
  ) {
    if (!member) {
      throw Error(`member not provided for '${COMMUNITY_NEW_MEMBER} event'`);
    }

    return {
      emailFrom: 'info@alkem.io',
      member: {
        name: member.displayName,
        email: member.email,
      },
      recipient: {
        firstname: recipient.firstName,
        email: recipient.email,
      },
      community: {
        name: eventPayload.community.name,
      },
    };
  }
}
