import { Injectable } from '@nestjs/common';
import { PreferenceType, RoleSetContributorType } from '@alkemio/client-lib';
import { INotificationBuilder } from '@core/contracts';
import { PlatformUser, User } from '@core/models';
import { NotificationBuilder, RoleConfig } from '../../../application';
import { EmailTemplate } from '@common/enums/email.template';
import { NotificationTemplateType } from '@src/types';
import { CommunityNewMemberEmailPayload } from '@common/email-template-payload';
import { CommunityNewMemberPayload } from '@alkemio/notifications-lib';
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
        preferenceType: PreferenceType.NotificationCommunityNewMemberAdmin,
        emailTemplate: EmailTemplate.COMMUNITY_NEW_MEMBER_ADMIN,
      },
      {
        role: 'member',
        preferenceType: PreferenceType.NotificationCommunityNewMember,
        emailTemplate: EmailTemplate.COMMUNITY_NEW_MEMBER_MEMBER,
      },
    ];

    const templateVariables = {
      memberID: payload.contributor.id,
      spaceID: payload.space.id,
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: undefined,
      roleConfig,
      templateType: 'community_new_member',
      templateVariables,
      templatePayloadBuilderFn: this.createEmailTemplatePayload.bind(this),
    });
  }

  private createEmailTemplatePayload(
    eventPayload: CommunityNewMemberPayload,
    recipient: User | PlatformUser
  ): CommunityNewMemberEmailPayload {
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);

    const newMember = eventPayload.contributor;
    const typeName =
      newMember.type === RoleSetContributorType.Virtual
        ? 'virtual contributor'
        : newMember.type;

    return {
      member: {
        name: newMember.profile.displayName,
        profile: newMember.profile.url,
        type: typeName,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      space: {
        displayName: eventPayload.space.profile.displayName,
        level: eventPayload.space.level,
        url: eventPayload.space.profile.url,
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }
}
