import { Injectable } from '@nestjs/common';
import { RoleSetContributorType } from '@alkemio/client-lib';
import { INotificationBuilder } from '@core/contracts';
import { PlatformUser, User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunityNewMemberEmailPayload } from '@common/email-template-payload';
import {
  CommunityNewMemberPayload,
  CompressedInAppNotificationPayload,
  InAppNotificationCategory,
  InAppNotificationCommunityNewMemberPayload,
  NotificationEventType,
} from '@alkemio/notifications-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { AlkemioClientAdapter } from '../../../application';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import { EventEmailRecipients } from '@src/core/models/EventEmailRecipients';

@Injectable()
export class CommunityNewMemberNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly alkemioClientAdapter: AlkemioClientAdapter
  ) {}

  public async getEmailRecipientSets(
    payload: CommunityNewMemberPayload
  ): Promise<EventEmailRecipients[]> {
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

    const emailRecipientsSets: EventEmailRecipients[] = [
      {
        emailRecipients: newMemberRecipients.emailRecipients,
        emailTemplate: EmailTemplate.COMMUNITY_NEW_MEMBER_MEMBER,
      },
      {
        emailRecipients: newMemberAdminRecipients.emailRecipients,
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

  public createInAppNotificationPayload(
    category: InAppNotificationCategory,
    receiverIDs: string[],
    event: CommunityNewMemberPayload
  ): CompressedInAppNotificationPayload<InAppNotificationCommunityNewMemberPayload> {
    const {
      space: { id: spaceID },
      triggeredBy: triggeredByID,
      contributor: { id: newMemberID, type: contributorType },
    } = event;

    return {
      type: NotificationEventType.COMMUNITY_NEW_MEMBER,
      triggeredAt: new Date(),
      receiverIDs,
      category,
      spaceID,
      triggeredByID,
      newMemberID,
      contributorType: contributorType,
      receiverID: '',
    };
  }
}
