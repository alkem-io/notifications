import { Injectable } from '@nestjs/common';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { INotificationBuilder } from '@core/contracts';
import { ExternalUser, User } from '@core/models';
import { CommunityExternalInvitationCreatedEventPayload } from '@alkemio/notifications-lib';
import { NotificationBuilder, RoleConfig } from '../../../application';
import { NotificationTemplateType } from '@src/types';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunityExternalInvitationCreatedEmailPayload } from '@common/email-template-payload';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';

@Injectable()
export class CommunityExternalInvitationCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<
      CommunityExternalInvitationCreatedEventPayload,
      CommunityExternalInvitationCreatedEmailPayload
    >
  ) {}

  build(
    payload: CommunityExternalInvitationCreatedEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'inviter',
        emailTemplate: EmailTemplate.COMMUNITY_EXTERNAL_INVITATION_INVITER,
      },
      {
        role: 'invitee',
        emailTemplate: EmailTemplate.COMMUNITY_EXTERNAL_INVITATION_INVITEE,
      },
    ];

    const templateVariables = {
      inviterID: payload.triggeredBy,
      spaceID: payload.space.id,
    };

    const externalUsers = payload.invitees.map(invitee => ({
      email: invitee.email,
      firstName: '',
      lastName: '',
    }));

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.triggeredBy,
      roleConfig,
      templateType: 'community_external_invitation_created',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
      externalUsers,
    });
  }

  private createTemplatePayload(
    eventPayload: CommunityExternalInvitationCreatedEventPayload,
    recipient: User | ExternalUser,
    inviter?: User
  ): CommunityExternalInvitationCreatedEmailPayload {
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
      emailFrom: 'info@alkem.io',
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
      journey: {
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
