import { Injectable, Inject } from '@nestjs/common';
import { ALKEMIO_URL_GENERATOR } from '@common/enums';
import { INotificationBuilder } from '@core/contracts';
import { User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunicationDiscussionCreatedEventPayload } from '@alkemio/notifications-lib';
import { UserPreferenceType } from '@alkemio/client-lib';
import {
  AlkemioUrlGenerator,
  NotificationBuilder,
  RoleConfig,
} from '../../../application';
import { NotificationTemplateType } from '@src/types';
import { CommunicationDiscussionCreatedEmailPayload } from '@common/email-template-payload';
import { NotificationEventType } from '@alkemio/notifications-lib';

@Injectable()
export class CommunicationDiscussionCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    @Inject(ALKEMIO_URL_GENERATOR)
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<
      CommunicationDiscussionCreatedEventPayload,
      CommunicationDiscussionCreatedEmailPayload
    >
  ) {}

  build(
    payload: CommunicationDiscussionCreatedEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'admin',
        emailTemplate: EmailTemplate.COMMUNICATION_DISCUSSION_CREATED_ADMIN,
        preferenceType:
          UserPreferenceType.NotificationCommunicationDiscussionCreatedAdmin,
      },
      {
        role: 'member',
        emailTemplate: EmailTemplate.COMMUNICATION_DISCUSSION_CREATED_MEMBER,
        preferenceType:
          UserPreferenceType.NotificationCommunicationDiscussionCreated,
      },
    ];

    const templateVariables = {
      hubID: payload.journey.hubID,
      challengeID: payload.journey.challenge?.id ?? '',
      opportunityID: payload.journey.challenge?.opportunity?.id ?? '',
      entityID:
        payload.journey?.challenge?.opportunity?.id ??
        payload.journey?.challenge?.id ??
        payload.journey.hubID,
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.discussion.createdBy,
      roleConfig,
      templateType: 'communication_discussion_created',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  createTemplatePayload(
    eventPayload: CommunicationDiscussionCreatedEventPayload,
    recipient: User,
    sender?: User
  ): CommunicationDiscussionCreatedEmailPayload {
    if (!sender) {
      throw Error(
        `Sender not provided for '${NotificationEventType.COMMUNICATION_DISCUSSION_CREATED}' event`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(
        recipient.nameID
      );
    const hubURL = this.alkemioUrlGenerator.createPlatformURL();
    return {
      emailFrom: 'info@alkem.io',
      createdBy: {
        firstName: sender.firstName,
      },
      discussion: {
        title: eventPayload.discussion.title,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      journey: {
        name: eventPayload.journey.displayName,
        type: eventPayload.journey.type,
        url: this.alkemioUrlGenerator.createJourneyURL(eventPayload.journey),
      },
      platform: {
        url: hubURL,
      },
    };
  }
}
