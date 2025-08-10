import { Injectable } from '@nestjs/common';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { PlatformUser, User } from '@core/models';
import { CommunityPlatformInvitationCreatedEventPayload } from '@alkemio/notifications-lib';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunityPlatformInvitationCreatedEmailPayload } from '@common/email-template-payload';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { ConfigService } from '@nestjs/config';
import { ConfigurationTypes } from '@src/common/enums';
import { AlkemioClientAdapter } from '@src/services/application/alkemio-client-adapter';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import { EventRecipientsSet } from '@src/core/models/EvenRecipientsSet';
import { INotificationBuilder } from '../notification.builder.interface';
import {
  InAppNotificationCategory,
  InAppNotificationEventType,
} from '@src/generated/graphql';
import { InAppNotificationPayloadBase } from '@src/types/in-app/in.app.notification.payload.base';

@Injectable()
export class CommunityPlatformInvitationCreatedNotificationBuilder
  implements INotificationBuilder
{
  invitationsPath: string;
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly configService: ConfigService,
    private readonly alkemioClientAdapter: AlkemioClientAdapter
  ) {
    this.invitationsPath = this.configService.get(
      ConfigurationTypes.ALKEMIO
    )?.webclient_invitations_path;
  }

  public async getEventRecipientSets(
    payload: CommunityPlatformInvitationCreatedEventPayload
  ): Promise<EventRecipientsSet[]> {
    const platformInvitationRecipients =
      await this.alkemioClientAdapter.getRecipients(
        UserNotificationEvent.SpaceCommunityInvitationUser,
        payload.space.id,
        payload.triggeredBy
      );

    const emailRecipientsSets: EventRecipientsSet[] = [
      {
        emailRecipients: platformInvitationRecipients.emailRecipients,
        inAppRecipients: platformInvitationRecipients.inAppRecipients,
        emailTemplate: EmailTemplate.COMMUNITY_PLATFORM_INVITATION_INVITEE,
        subjectUser: platformInvitationRecipients.triggeredBy,
      },
    ];
    return emailRecipientsSets;
  }

  public createEmailTemplatePayload(
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
      emails: emails,
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
    eventPayload: CommunityPlatformInvitationCreatedEventPayload,
    category: InAppNotificationCategory,
    receiverIDs: string[]
  ): InAppNotificationPayloadBase {
    return {
      type: InAppNotificationEventType.CommunityInvitationCreated,
      triggeredAt: new Date(),
      category,
      triggeredByID: eventPayload.triggeredBy,
      receiverIDs,
    };
  }
}
