import { Injectable } from '@nestjs/common';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { INotificationBuilder } from '@core/contracts';
import { PlatformUser, User } from '@core/models';
import { CommunityPlatformInvitationCreatedEventPayload } from '@alkemio/notifications-lib';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunityPlatformInvitationCreatedEmailPayload } from '@common/email-template-payload';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { ConfigService } from '@nestjs/config';
import { ConfigurationTypes } from '@src/common/enums';
import { AlkemioClientAdapter } from '../../../application';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import { EventEmailRecipients } from '@src/core/models/EventEmailRecipients';

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

  public async getEmailRecipientSets(
    payload: CommunityPlatformInvitationCreatedEventPayload
  ): Promise<EventEmailRecipients[]> {
    const platformInvitationRecipients =
      await this.alkemioClientAdapter.getRecipients(
        UserNotificationEvent.SpaceCommunityInvitationUser,
        payload.space.id,
        payload.triggeredBy
      );

    const emailRecipientsSets: EventEmailRecipients[] = [
      {
        emailRecipients: platformInvitationRecipients.emailRecipients,
        emailTemplate: EmailTemplate.COMMUNITY_PLATFORM_INVITATION_INVITEE,
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
}
