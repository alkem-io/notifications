import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '@core/contracts';
import { PlatformUser, User } from '@core/models';
import { AlkemioClientAdapter } from '../../../application';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunityInvitationCreatedEmailPayload } from '@common/email-template-payload';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { ConfigService } from '@nestjs/config';
import { ConfigurationTypes } from '@src/common/enums';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import {
  CommunityInvitationCreatedEventPayload,
  InAppNotificationCategory,
  InAppNotificationPayloadBase,
  NotificationEventType,
} from '@alkemio/notifications-lib';
import { EventRecipientsSet } from '@src/core/models/EvenRecipientsSet';

@Injectable()
export class CommunityInvitationCreatedNotificationBuilder
  implements INotificationBuilder
{
  invitationsPath: string;
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly alkemioClientAdapter: AlkemioClientAdapter,
    private readonly configService: ConfigService
  ) {
    this.invitationsPath = this.configService.get(
      ConfigurationTypes.ALKEMIO
    )?.webclient_invitations_path;
  }

  public async getEmailRecipientSets(
    payload: CommunityInvitationCreatedEventPayload
  ): Promise<EventRecipientsSet[]> {
    const applicationSubmittedRecipients =
      await this.alkemioClientAdapter.getRecipients(
        UserNotificationEvent.SpaceCommunityInvitationUser,
        payload.space.id,
        payload.triggeredBy
      );

    const emailRecipientsSets: EventRecipientsSet[] = [
      {
        emailRecipients: applicationSubmittedRecipients.emailRecipients,
        inAppRecipients: applicationSubmittedRecipients.inAppRecipients,
        emailTemplate: EmailTemplate.COMMUNITY_INVITATION_INVITEE,
      },
    ];
    return emailRecipientsSets;
  }

  public createEmailTemplatePayload(
    eventPayload: CommunityInvitationCreatedEventPayload,
    recipient: User | PlatformUser,
    inviter?: User
  ): CommunityInvitationCreatedEmailPayload {
    if (!inviter) {
      throw Error(
        `Invitee not provided for '${NotificationEventType.COMMUNITY_INVITATION_CREATED} event'`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);
    const invitationsURL = `${eventPayload.platform.url.replace(/\/+$/, '')}${
      this.invitationsPath
    }`;

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
      welcomeMessage: eventPayload.welcomeMessage,
      space: {
        displayName: eventPayload.space.profile.displayName,
        level: eventPayload.space.level,
        url: eventPayload.space.profile.url,
      },
      platform: {
        url: eventPayload.platform.url,
      },
      invitationsURL,
    };
  }

  createInAppTemplatePayload(
    eventPayload: CommunityInvitationCreatedEventPayload,
    category: InAppNotificationCategory,
    receiverIDs: string[]
  ): InAppNotificationPayloadBase {
    return {
      type: NotificationEventType.COMMUNITY_INVITATION_CREATED,
      triggeredAt: new Date(),
      receiverIDs,
      category,
      triggeredByID: eventPayload.triggeredBy,
      receiverID: receiverIDs[0], // For individual notifications
    };
  }
}
