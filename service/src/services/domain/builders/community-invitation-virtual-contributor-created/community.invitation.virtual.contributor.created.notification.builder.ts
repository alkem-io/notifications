import { Injectable } from '@nestjs/common';
import {
  CommunityInvitationVirtualContributorCreatedEventPayload,
  NotificationEventType,
} from '@alkemio/notifications-lib';
import { INotificationBuilder } from '@core/contracts';
import { PlatformUser, User } from '@core/models';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { NotificationBuilder, RoleConfig } from '@src/services/application';
import { NotificationTemplateType } from '@src/types';
import { EmailTemplate } from '@src/common/enums/email.template';
import { PreferenceType } from '@alkemio/client-lib';
import { CommunityInvitationVirtualContributorCreatedEmailPayload } from '@src/common/email-template-payload';

@Injectable()
export class CommunityInvitationVirtualContributorCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<
      CommunityInvitationVirtualContributorCreatedEventPayload,
      CommunityInvitationVirtualContributorCreatedEmailPayload
    >
  ) {}

  build(
    payload: CommunityInvitationVirtualContributorCreatedEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'host',
        emailTemplate: EmailTemplate.COMMUNITY_INVITATION_CREATED_VC_HOST,
        preferenceType: PreferenceType.NotificationCommunityInvitationUser,
      },
    ];

    const templateVariables = {
      inviterID: payload.triggeredBy,
      spaceID: payload.space.id,
      hostUserID: payload.host.id,
      hostOrganizationID: payload.host.id,
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.triggeredBy,
      roleConfig,
      templateType: 'community_invitation_created_vc',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  private createTemplatePayload(
    eventPayload: CommunityInvitationVirtualContributorCreatedEventPayload,
    recipient: User | PlatformUser,
    inviter?: User
  ): CommunityInvitationVirtualContributorCreatedEmailPayload {
    if (!inviter) {
      throw Error(
        `Invitee not provided for '${NotificationEventType.COMMUNITY_INVITATION_CREATED_VC} event'`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);

    return {
      inviter: {
        firstName: inviter.firstName,
        name: inviter.profile.displayName,
        profile: inviter.profile.url,
        email: inviter.email,
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
      virtualContributor: {
        name: eventPayload.invitee.profile.displayName,
        url: eventPayload.invitee.profile.url,
      },
      platform: {
        url: eventPayload.platform.url,
      },
      welcomeMessage: eventPayload.welcomeMessage,
      spaceAdminURL: eventPayload.space.adminURL,
    };
  }
}
