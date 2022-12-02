import { Inject, Injectable } from '@nestjs/common';
import { UserPreferenceType } from '@alkemio/client-lib';
import { INotificationBuilder } from '@core/contracts';
import { CollaborationCardCommentEventPayload } from '@alkemio/notifications-lib';
import { AspectCommentCreatedEmailPayload } from '@common/email-template-payload';
import {
  AlkemioUrlGenerator,
  NotificationBuilder,
  RoleConfig,
} from '@src/services/application';
import { NotificationTemplateType } from '@src/types';
import { EmailTemplate } from '@common/enums/email.template';
import { User } from '@core/models';
import { ALKEMIO_URL_GENERATOR } from '@common/enums';
import { NotificationEventType } from '@alkemio/notifications-lib';

@Injectable()
export class CollaborationCardCommentNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly notificationBuilder: NotificationBuilder<
      CollaborationCardCommentEventPayload,
      AspectCommentCreatedEmailPayload
    >,
    @Inject(ALKEMIO_URL_GENERATOR)
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator
  ) {}
  build(
    payload: CollaborationCardCommentEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'owner',
        preferenceType: UserPreferenceType.NotificationAspectCommentCreated,
        emailTemplate: EmailTemplate.COLLABORATION_CARD_COMMENT_MEMBER,
      },
    ];

    const templateVariables = {
      ownerID: payload.card.createdBy,
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.comment.createdBy,
      roleConfig,
      templateType: 'aspect_comment_created',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  createTemplatePayload(
    eventPayload: CollaborationCardCommentEventPayload,
    recipient: User,
    commentAuthor?: User
  ): AspectCommentCreatedEmailPayload {
    if (!commentAuthor) {
      throw Error(
        `Comment author not provided for '${NotificationEventType.COMMENT_CREATED_ON_ASPECT} event'`
      );
    }
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(
        recipient.nameID
      );

    const communityURL = this.alkemioUrlGenerator.createCommunityURL(
      eventPayload.journey.hubNameID,
      eventPayload.journey.challenge?.nameID,
      eventPayload.journey.challenge?.opportunity?.nameID
    );

    const hubURL = this.alkemioUrlGenerator.createHubURL();

    return {
      emailFrom: 'info@alkem.io',
      aspect: {
        displayName: eventPayload.card.displayName,
      },
      recipient: {
        firstname: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      createdBy: {
        firstname: commentAuthor.firstName,
        email: commentAuthor.email,
      },
      community: {
        name: eventPayload.journey.displayName,
        url: communityURL,
      },
      hub: {
        url: hubURL,
      },
    };
  }
}
