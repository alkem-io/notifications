import { INotificationBuilder } from '@core/contracts';
import { PlatformUser, User } from '@core/models';
import { AlkemioClientAdapter } from '@src/services/application/alkemio-client-adapter';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunityApplicationCreatedEmailPayload } from '@common/email-template-payload';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import {
  CommunityApplicationCreatedEventPayload,
  InAppNotificationCategory,
  InAppNotificationPayloadBase,
  NotificationEventType,
} from '@alkemio/notifications-lib';
import { EventRecipientsSet } from '@src/core/models/EvenRecipientsSet';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommunityApplicationCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly alkemioClientAdapter: AlkemioClientAdapter
  ) {}

  public async getEventRecipientSets(
    payload: CommunityApplicationCreatedEventPayload
  ): Promise<EventRecipientsSet[]> {
    const applicationSubmittedRecipients =
      await this.alkemioClientAdapter.getRecipients(
        UserNotificationEvent.SpaceApplicationSubmitted,
        payload.space.id,
        payload.triggeredBy
      );

    const applicationReceivedRecipients =
      await this.alkemioClientAdapter.getRecipients(
        UserNotificationEvent.SpaceApplicationReceived,
        payload.space.id,
        payload.triggeredBy
      );

    const emailRecipientsSets: EventRecipientsSet[] = [
      {
        emailRecipients: applicationSubmittedRecipients.emailRecipients,
        inAppRecipients: applicationSubmittedRecipients.inAppRecipients,
        emailTemplate: EmailTemplate.COMMUNITY_USER_APPLICATION_APPLICANT,
      },
      {
        emailRecipients: applicationReceivedRecipients.emailRecipients,
        inAppRecipients: applicationReceivedRecipients.inAppRecipients,
        emailTemplate: EmailTemplate.COMMUNITY_USER_APPLICATION_ADMIN,
      },
    ];
    return emailRecipientsSets;
  }

  public createEmailTemplatePayload(
    eventPayload: CommunityApplicationCreatedEventPayload,
    recipient: User | PlatformUser,
    applicant?: User
  ): CommunityApplicationCreatedEmailPayload {
    if (!applicant) {
      throw Error(
        `Applicant not provided for '${NotificationEventType.COMMUNITY_APPLICATION_CREATED} event'`
      );
    }

    const isLevel0Space = eventPayload.space.level === '0';
    const spaceType = isLevel0Space ? 'space' : 'subspace';

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);
    return {
      applicant: {
        firstName: applicant.firstName,
        name: applicant.profile.displayName,
        email: applicant.email,
        profile: applicant.profile.url,
      },
      spaceAdminURL: eventPayload.space.adminURL,
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      space: {
        displayName: eventPayload.space.profile.displayName,
        level: eventPayload.space.level,
        url: eventPayload.space.profile.url,
        type: spaceType,
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }

  createInAppTemplatePayload(
    eventPayload: CommunityApplicationCreatedEventPayload,
    category: InAppNotificationCategory,
    receiverIDs: string[]
  ): InAppNotificationPayloadBase {
    return {
      type: NotificationEventType.COMMUNITY_APPLICATION_CREATED,
      triggeredAt: new Date(),
      category,
      triggeredByID: eventPayload.triggeredBy,
      receiverIDs,
    };
  }
}
