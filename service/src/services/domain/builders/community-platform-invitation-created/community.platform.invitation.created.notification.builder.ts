import { Injectable } from '@nestjs/common';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { INotificationBuilder } from '@core/contracts';
import { PlatformUser, User } from '@core/models';
import { CommunityPlatformInvitationCreatedEventPayload } from '@alkemio/notifications-lib';
import { NotificationBuilder, RoleConfig } from '../../../application';
import { NotificationTemplateType } from '@src/types';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunityPlatformInvitationCreatedEmailPayload } from '@common/email-template-payload';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { ConfigService } from '@nestjs/config';
import { ConfigurationTypes } from '@src/common/enums';

@Injectable()
export class CommunityPlatformInvitationCreatedNotificationBuilder
  implements INotificationBuilder
{
  invitationsPath: string;
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<
      CommunityPlatformInvitationCreatedEventPayload,
      CommunityPlatformInvitationCreatedEmailPayload
    >,
    private readonly configService: ConfigService
  ) {
    this.invitationsPath = this.configService.get(
      ConfigurationTypes.ALKEMIO
    )?.webclient_invitations_path;
  }

  build(
    payload: CommunityPlatformInvitationCreatedEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'inviter',
        emailTemplate: EmailTemplate.COMMUNITY_PLATFORM_INVITATION_INVITER,
      },
      {
        role: 'invitee',
        emailTemplate: EmailTemplate.COMMUNITY_PLATFORM_INVITATION_INVITEE,
      },
    ];

    const templateVariables = {
      inviterID: payload.triggeredBy,
      spaceID: payload.space.id,
    };

    const platformUsers = payload.invitees.map(invitee => ({
      email: invitee.email,
      firstName: '',
      lastName: '',
    }));

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.triggeredBy,
      roleConfig,
      templateType: 'community_platform_invitation_created',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
      platformUsers: platformUsers,
    });
  }

  private createTemplatePayload(
    eventPayload: CommunityPlatformInvitationCreatedEventPayload,
    recipient: User | PlatformUser,
    inviter?: User
  ): CommunityPlatformInvitationCreatedEmailPayload {
    if (!inviter) {
      throw Error(
        `Invitee not provided for '${NotificationEventType.COMMUNITY_INVITATION_CREATED} event'`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);
    const emails = [...eventPayload.invitees]
      .map(invitedUser => invitedUser.email)
      .join(', ');

    return {
      inviter: {
        firstName: inviter.firstName,
        name: inviter.profile.displayName,
        email: inviter.email,
        profile: inviter.profile.url,
      },
      spaceAdminURL: eventPayload.space.adminURL,
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      emails: emails,
      welcomeMessage: eventPayload.welcomeMessage,
      space: {
        displayName: eventPayload.space.profile.displayName,
        type: eventPayload.space.type,
        url: eventPayload.space.profile.url,
      },
      platform: {
        url: eventPayload.platform.url,
      },
      invitationsURL: `${eventPayload.platform.url}${this.invitationsPath}`,
    };
  }
}
