import { Inject, Injectable } from '@nestjs/common';
import { UserPreferenceType } from '@alkemio/client-lib';
import { INotificationBuilder } from '@core/contracts';
import { CollaborationCardCommentEventPayload } from '@alkemio/notifications-lib';
import { CollaborationCardCommentEmailPayload } from '@common/email-template-payload';
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
      CollaborationCardCommentEmailPayload
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
      templateType: 'collaboration_card_comment',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  createTemplatePayload(
    eventPayload: CollaborationCardCommentEventPayload,
    recipient: User,
    commentAuthor?: User
  ): CollaborationCardCommentEmailPayload {
    if (!commentAuthor) {
      throw Error(
        `Comment author not provided for '${NotificationEventType.COLLABORATION_CARD_COMMENT} event'`
      );
    }
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(
        recipient.nameID
      );

    const hubURL = this.alkemioUrlGenerator.createPlatformURL();
    const journeyURL = this.alkemioUrlGenerator.createJourneyURL(
      eventPayload.journey
    );
    const cardURL = this.alkemioUrlGenerator.createCardURL(
      journeyURL,
      eventPayload.callout.nameID,
      eventPayload.card.nameID
    );
    const calloutURL = this.alkemioUrlGenerator.createCalloutURL(
      journeyURL,
      eventPayload.callout.nameID
    );

    return {
      emailFrom: 'info@alkem.io',
      callout: {
        displayName: eventPayload.callout.displayName,
        url: calloutURL,
      },
      card: {
        displayName: eventPayload.card.displayName,
        url: cardURL,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      createdBy: {
        firstName: commentAuthor.firstName,
        email: commentAuthor.email,
      },
      journey: {
        displayName: eventPayload.journey.displayName,
        type: eventPayload.journey.type,
        url: journeyURL,
      },
      platform: {
        url: hubURL,
      },
    };
  }
}
