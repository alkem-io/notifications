import { Injectable, Inject } from '@nestjs/common';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { INotificationBuilder } from '@core/contracts';
import { User } from '@core/models';
import { CommunityInvitationCreatedEventPayload } from '@alkemio/notifications-lib';
import {
  AlkemioUrlGenerator,
  NotificationBuilder,
  RoleConfig,
} from '../../../application';
import { NotificationTemplateType } from '@src/types';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunityInvitationCreatedEmailPayload } from '@common/email-template-payload';
import { ALKEMIO_URL_GENERATOR } from '@src/common/enums/providers';

@Injectable()
export class CommunityInvitationCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    @Inject(ALKEMIO_URL_GENERATOR)
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<
      CommunityInvitationCreatedEventPayload,
      CommunityInvitationCreatedEmailPayload
    >
  ) {}

  build(
    payload: CommunityInvitationCreatedEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'invitee',
        emailTemplate: EmailTemplate.COMMUNITY_INVITATION_INVITEE,
      },
    ];

    const templateVariables = {
      inviterID: payload.triggeredBy,
      inviteeID: payload.inviteeID,
      hubID: payload.journey.hubID,
      challengeID: payload.journey.challenge?.id ?? '',
      opportunityID: payload.journey.challenge?.opportunity?.id ?? '',
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.inviteeID,
      roleConfig,
      templateType: 'community_invitation_created',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  private createTemplatePayload(
    eventPayload: CommunityInvitationCreatedEventPayload,
    recipient: User,
    invitee?: User
  ): CommunityInvitationCreatedEmailPayload {
    if (!invitee) {
      throw Error(
        `Invitee not provided for '${NotificationEventType.COMMUNITY_INVITATION_CREATED} event'`
      );
    }
    const inviteeProfileURL = this.alkemioUrlGenerator.createUserURL(
      invitee.nameID
    );
    const communityURL = this.alkemioUrlGenerator.createJourneyURL(
      eventPayload.journey
    );
    const communityAdminURL =
      this.alkemioUrlGenerator.createJourneyAdminCommunityURL(
        eventPayload.journey
      );
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(
        recipient.nameID
      );
    const alkemioURL = this.alkemioUrlGenerator.createPlatformURL();
    return {
      emailFrom: 'info@alkem.io',
      invitee: {
        firstName: invitee.firstName,
        name: invitee.profile.displayName,
        email: invitee.email,
        profile: inviteeProfileURL,
      },
      journeyAdminURL: communityAdminURL,
      recipient: {
        firstName: recipient.profile.displayName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
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
