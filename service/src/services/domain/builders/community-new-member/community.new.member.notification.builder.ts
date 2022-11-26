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
import { CommunityNewMemberPayload } from '@alkemio/notifications-lib/src/dto';
import { NotificationTemplateType } from '@src/types';
import { ALKEMIO_URL_GENERATOR } from '@common/enums';
import { CommunityNewMemberEmailPayload } from '@common/email-template-payload';
import { NotificationEventType } from '@alkemio/notifications-lib/src/notification.event.type';

@Injectable()
export class CommunityNewMemberNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly notificationBuilder: NotificationBuilder<
      CommunityNewMemberPayload,
      CommunityNewMemberEmailPayload
    >,
    @Inject(ALKEMIO_URL_GENERATOR)
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator
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
  ): CommunityNewMemberEmailPayload {
    if (!member) {
      throw Error(
        `member not provided for '${NotificationEventType.COMMUNITY_NEW_MEMBER} event'`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(
        recipient.nameID
      );

    const hubURL = this.alkemioUrlGenerator.createHubURL();
    const memberProfileURL = this.alkemioUrlGenerator.createUserURL(
      member.nameID
    );

    return {
      emailFrom: 'info@alkem.io',
      member: {
        name: member.displayName,
        email: member.email,
        profile: memberProfileURL,
      },
      recipient: {
        firstname: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      community: {
        name: eventPayload.community.name,
      },
      hub: {
        url: hubURL,
      },
    };
  }
}
