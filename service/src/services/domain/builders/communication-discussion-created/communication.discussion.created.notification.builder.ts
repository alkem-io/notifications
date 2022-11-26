import { Injectable, Inject } from '@nestjs/common';
import { ALKEMIO_URL_GENERATOR } from '@common/enums';
import { INotificationBuilder } from '@core/contracts';
import { User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunicationDiscussionCreatedEventPayload } from '@alkemio/notifications-lib/dist/dto';
import { UserPreferenceType } from '@alkemio/client-lib';
import {
  AlkemioUrlGenerator,
  NotificationBuilder,
  RoleConfig,
} from '../../../application';
import { NotificationTemplateType } from '@src/types';
import { CommunicationDiscussionCreatedEmailPayload } from '@common/email-template-payload';
import { NotificationEventType } from '@alkemio/notifications-lib/dist/notification.event.type';

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
      hubID: payload.hub.id,
      challengeID: payload.hub.challenge?.id ?? '',
      opportunityID: payload.hub.challenge?.opportunity?.id ?? '',
      entityID:
        payload.hub?.challenge?.opportunity?.id ??
        payload.hub?.challenge?.id ??
        payload.hub.id,
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

    const communityURL = this.alkemioUrlGenerator.createCommunityURL(
      eventPayload.hub.nameID,
      eventPayload.hub.challenge?.nameID,
      eventPayload.hub.challenge?.opportunity?.nameID
    );
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(
        recipient.nameID
      );
    const hubURL = this.alkemioUrlGenerator.createHubURL();
    return {
      emailFrom: 'info@alkem.io',
      createdBy: {
        firstname: sender.firstName,
      },
      discussion: {
        title: eventPayload.discussion.title,
      },
      recipient: {
        firstname: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      community: {
        name: eventPayload.community.name,
        url: communityURL,
      },
      hub: {
        url: hubURL,
      },
    };
  }
}
