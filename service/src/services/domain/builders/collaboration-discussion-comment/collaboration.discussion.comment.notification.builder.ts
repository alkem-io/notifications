import { Inject, Injectable } from '@nestjs/common';
import { UserPreferenceType } from '@alkemio/client-lib';
import { INotificationBuilder } from '@core/contracts';
import {
  AlkemioUrlGenerator,
  NotificationBuilder,
  RoleConfig,
} from '@src/services/application';
import { NotificationTemplateType } from '@src/types';
import { EmailTemplate } from '@common/enums/email.template';
import { User } from '@core/models';
import { ALKEMIO_URL_GENERATOR } from '@common/enums';
import {
  CollaborationDiscussionCommentEventPayload,
  NotificationEventType,
} from '@alkemio/notifications-lib';
import { CollaborationDiscussionCommentEmailPayload } from '@src/common/email-template-payload';

@Injectable()
export class CollaborationDiscussionCommentNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly notificationBuilder: NotificationBuilder<
      CollaborationDiscussionCommentEventPayload,
      CollaborationDiscussionCommentEmailPayload
    >,
    @Inject(ALKEMIO_URL_GENERATOR)
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator
  ) {}
  build(
    payload: CollaborationDiscussionCommentEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'member',
        preferenceType: UserPreferenceType.NotificationDiscussionCommentCreated,
        emailTemplate: EmailTemplate.COLLABORATION_DISCUSSION_COMMENT_MEMBER,
      },
    ];

    const templateVariables = {
      journeyID:
        payload.journey?.challenge?.opportunity?.id ??
        payload.journey?.challenge?.id ??
        payload.journey.hubID,
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.comment.createdBy,
      roleConfig,
      templateType: 'collaboration_discussion_comment',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  createTemplatePayload(
    eventPayload: CollaborationDiscussionCommentEventPayload,
    recipient: User,
    commentAuthor?: User
  ): CollaborationDiscussionCommentEmailPayload {
    if (!commentAuthor) {
      throw Error(
        `Comment author not provided for '${NotificationEventType.COLLABORATION_DISCUSSION_COMMENT} event'`
      );
    }
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(
        recipient.nameID
      );

    const alkemioURL = this.alkemioUrlGenerator.createPlatformURL();
    const journeyURL = this.alkemioUrlGenerator.createJourneyURL(
      eventPayload.journey
    );

    const calloutURL = this.alkemioUrlGenerator.createCalloutURL(
      journeyURL,
      eventPayload.callout.nameID
    );

    const result: CollaborationDiscussionCommentEmailPayload = {
      emailFrom: 'info@alkem.io',
      callout: {
        displayName: eventPayload.callout.displayName,
        url: calloutURL,
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
        url: alkemioURL,
      },
      message: eventPayload.comment.message,
    };
    return result;
  }
}
