import { Injectable } from '@nestjs/common';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { INotificationBuilder } from '@core/contracts';
import { ExternalUser, User } from '@core/models';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { NotificationBuilder, RoleConfig } from '@src/services/application';
import { NotificationTemplateType } from '@src/types';
import { EmailTemplate } from '@src/common/enums/email.template';
import { UserPreferenceType } from '@alkemio/client-lib';
import { VirtualContributorInvitationCreatedEmailPayload } from '@src/common/email-template-payload';
import { VirtualContributorInvitationCreatedEventPayload } from '@alkemio/notifications-lib/dist/dto/virtual.contributor.invitation.created.event.payload';

@Injectable()
export class VirtualContributorInvitationCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<
      VirtualContributorInvitationCreatedEventPayload,
      VirtualContributorInvitationCreatedEmailPayload
    >
  ) {}

  build(
    payload: VirtualContributorInvitationCreatedEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'host',
        emailTemplate: EmailTemplate.COMMUNITY_INVITATION_CREATED_VC_HOST,
        preferenceType: UserPreferenceType.NotificationCommunityInvitationUser,
      },
    ];

    const templateVariables = {
      inviterID: payload.triggeredBy,
      virtualContributorID: '-1',
      spaceID: payload.space.id,
      hostUserID: payload.host.id,
      hostOrganizationID: payload.host.id,
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.triggeredBy,
      roleConfig,
      templateType: 'community_invitation_created_vc_host',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  private createTemplatePayload(
    eventPayload: VirtualContributorInvitationCreatedEventPayload,
    recipient: User | ExternalUser,
    inviter?: User
  ): VirtualContributorInvitationCreatedEmailPayload {
    if (!inviter) {
      throw Error(
        `Invitee not provided for '${NotificationEventType.COMMUNITY_INVITATION_CREATED_VC} event'`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);

    return {
      emailFrom: 'info@alkem.io',
      inviter: {
        firstName: inviter.firstName,
        name: inviter.profile.displayName,
        url: inviter.profile.url,
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
        name: (eventPayload as any).virtualContributor.name,
        url: (eventPayload as any).virtualContributor.url,
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }
}
