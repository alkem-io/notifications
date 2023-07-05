import { Injectable, Inject } from '@nestjs/common';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { INotificationBuilder } from '@core/contracts';
import { ExternalUser, User } from '@core/models';
import { CommunityExternalInvitationCreatedEventPayload } from '@alkemio/notifications-lib';
import {
  AlkemioUrlGenerator,
  NotificationBuilder,
  RoleConfig,
} from '../../../application';
import { NotificationTemplateType } from '@src/types';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunityExternalInvitationCreatedEmailPayload } from '@common/email-template-payload';
import { ALKEMIO_URL_GENERATOR } from '@src/common/enums/providers';

@Injectable()
export class CommunityExternalInvitationCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    @Inject(ALKEMIO_URL_GENERATOR)
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
      spaceID: payload.journey.spaceID,
      challengeID: payload.journey.challenge?.id ?? '',
      opportunityID: payload.journey.challenge?.opportunity?.id ?? '',
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
    const inviterProfileURL = this.alkemioUrlGenerator.createUserURL(
      inviter.nameID
    );
    const communityURL = this.alkemioUrlGenerator.createJourneyURL(
      eventPayload.journey
    );
    const communityAdminURL =
      this.alkemioUrlGenerator.createJourneyAdminCommunityURL(
        eventPayload.journey
      );
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);
    const alkemioURL = this.alkemioUrlGenerator.createPlatformURL();
    const emails = [...eventPayload.invitees]
      .map(invitedUser => invitedUser.email)
      .join(', ');

    return {
      emailFrom: 'info@alkem.io',
      inviter: {
        firstName: inviter.firstName,
        name: inviter.profile.displayName,
        email: inviter.email,
        profile: inviterProfileURL,
      },
      journeyAdminURL: communityAdminURL,
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      emails: emails,
      welcomeMessage: eventPayload.welcomeMessage,
      journey: {
        displayName: eventPayload.journey.displayName,
        type: eventPayload.journey.type,
        url: communityURL,
      },
      platform: {
        url: alkemioURL,
      },
    };
  }
}
