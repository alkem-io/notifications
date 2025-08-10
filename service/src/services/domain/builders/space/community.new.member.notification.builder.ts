import { Injectable } from '@nestjs/common';
import { RoleSetContributorType } from '@alkemio/client-lib';
import { INotificationBuilder } from '../notification.builder.interface';
import { PlatformUser, User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunityNewMemberEmailPayload } from '@common/email-template-payload';
import { CommunityNewMemberPayload } from '@alkemio/notifications-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { AlkemioClientAdapter } from '@src/services/application/alkemio-client-adapter';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import { EventRecipientsSet } from '@src/core/models/EvenRecipientsSet';
import { InAppNotificationCommunityNewMemberPayload } from '@src/types/in-app/in.app.notification.community.new.member.payload';
import {
  InAppNotificationCategory,
  InAppNotificationEventType,
} from '@src/generated/graphql';
@Injectable()
export class CommunityNewMemberNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly alkemioClientAdapter: AlkemioClientAdapter
  ) {}

  public async getEventRecipientSets(
    payload: CommunityNewMemberPayload
  ): Promise<EventRecipientsSet[]> {
    const newMemberRecipients = await this.alkemioClientAdapter.getRecipients(
      UserNotificationEvent.SpaceCommunityNewMember,
      payload.space.id,
      payload.triggeredBy
    );

    const newMemberAdminRecipients =
      await this.alkemioClientAdapter.getRecipients(
        UserNotificationEvent.SpaceCommunityNewMemberAdmin,
        payload.space.id,
        payload.triggeredBy
      );

    const emailRecipientsSets: EventRecipientsSet[] = [
      {
        emailRecipients: newMemberRecipients.emailRecipients,
        inAppRecipients: newMemberRecipients.inAppRecipients,
        emailTemplate: EmailTemplate.COMMUNITY_NEW_MEMBER_MEMBER,
      },
      {
        emailRecipients: newMemberAdminRecipients.emailRecipients,
        inAppRecipients: newMemberAdminRecipients.inAppRecipients,
        emailTemplate: EmailTemplate.COMMUNITY_NEW_MEMBER_ADMIN,
      },
    ];
    return emailRecipientsSets;
  }

  public createEmailTemplatePayload(
    eventPayload: CommunityNewMemberPayload,
    recipient: User | PlatformUser
  ): CommunityNewMemberEmailPayload {
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);

    const newMember = eventPayload.contributor;
    const typeName =
      newMember.type === RoleSetContributorType.Virtual
        ? 'virtual contributor'
        : newMember.type;

    return {
      member: {
        name: newMember.profile.displayName,
        profile: newMember.profile.url,
        type: typeName,
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
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }

  public createInAppTemplatePayload(
    eventPayload: CommunityNewMemberPayload,
    category: InAppNotificationCategory,
    receiverIDs: string[]
  ): InAppNotificationCommunityNewMemberPayload {
    const { triggeredBy: triggeredByID } = eventPayload;

    return {
      type: InAppNotificationEventType.CommunityNewMember,
      triggeredAt: new Date(),
      category,
      triggeredByID,
      receiverIDs,
      contributorType: eventPayload.contributor.type,
      newMemberID: eventPayload.contributor.id,
      spaceID: eventPayload.space.id,
    };
  }
}
