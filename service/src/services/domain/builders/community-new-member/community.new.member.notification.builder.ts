import { Injectable } from '@nestjs/common';
import { UserPreferenceType } from '@alkemio/client-lib';
import { INotificationBuilder } from '@core/contracts';
import { PlatformUser, User } from '@core/models';
import { NotificationBuilder, RoleConfig } from '../../../application';
import { EmailTemplate } from '@common/enums/email.template';
import { NotificationTemplateType } from '@src/types';
import { CommunityNewMemberEmailPayload } from '@common/email-template-payload';
import {
  CommunityNewMemberPayload,
  NotificationEventType,
} from '@alkemio/notifications-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';

@Injectable()
export class CommunityNewMemberNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<
      CommunityNewMemberPayload,
      CommunityNewMemberEmailPayload
    >
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
      memberID: payload.contributor.id,
      spaceID: payload.space.id,
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.contributor.id,
      roleConfig,
      templateType: 'community_new_member',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  private createTemplatePayload(
    eventPayload: CommunityNewMemberPayload,
    recipient: User | PlatformUser,
    member?: User
  ): CommunityNewMemberEmailPayload {
    if (!member) {
      throw Error(
        `member not provided for '${NotificationEventType.COMMUNITY_NEW_MEMBER} event'`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);

    const memberProfileURL = member.profile.url;

    return {
      emailFrom: 'info@alkem.io',
      member: {
        name: member.profile.displayName,
        email: member.email,
        profile: memberProfileURL,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      space: {
        displayName: eventPayload.space.profile.displayName,
        type: eventPayload.space.type,
        url: eventPayload.space.profile.url,
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }
}
