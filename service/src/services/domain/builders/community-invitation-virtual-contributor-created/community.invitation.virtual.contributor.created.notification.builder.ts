import { Injectable } from '@nestjs/common';
import {
  CommunityInvitationVirtualContributorCreatedEventPayload,
  InAppNotificationCategory,
  InAppNotificationPayloadBase,
  NotificationEventType,
} from '@alkemio/notifications-lib';
import { INotificationBuilder } from '@core/contracts';
import { PlatformUser, User } from '@core/models';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { EmailTemplate } from '@src/common/enums/email.template';
import { CommunityInvitationVirtualContributorCreatedEmailPayload } from '@src/common/email-template-payload';
import { AlkemioClientAdapter } from '@src/services/application/alkemio-client-adapter';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import { EventRecipientsSet } from '@src/core/models/EvenRecipientsSet';

@Injectable()
export class CommunityInvitationVirtualContributorCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly alkemioClientAdapter: AlkemioClientAdapter
  ) {}

  public async getEventRecipientSets(
    payload: CommunityInvitationVirtualContributorCreatedEventPayload
  ): Promise<EventRecipientsSet[]> {
    const virtualContributorInvitationRecipients =
      await this.alkemioClientAdapter.getRecipients(
        UserNotificationEvent.SpaceCommunityInvitationUser,
        payload.space.id,
        payload.triggeredBy
      );

    const emailRecipientsSets: EventRecipientsSet[] = [
      {
        emailRecipients: virtualContributorInvitationRecipients.emailRecipients,
        inAppRecipients: virtualContributorInvitationRecipients.inAppRecipients,
        emailTemplate: EmailTemplate.COMMUNITY_INVITATION_CREATED_VC_HOST,
      },
    ];
    return emailRecipientsSets;
  }

  public createEmailTemplatePayload(
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
        level: eventPayload.space.level,
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

  createInAppTemplatePayload(
    eventPayload: CommunityInvitationVirtualContributorCreatedEventPayload,
    category: InAppNotificationCategory,
    receiverIDs: string[]
  ): InAppNotificationPayloadBase {
    return {
      type: NotificationEventType.COMMUNITY_INVITATION_CREATED_VC,
      triggeredAt: new Date(),
      receiverIDs,
      category,
      triggeredByID: eventPayload.triggeredBy,
      receiverID: receiverIDs[0], // For individual notifications
    };
  }
}
