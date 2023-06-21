import { Inject, Injectable } from '@nestjs/common';
import { UserPreferenceType } from '@alkemio/client-lib';
import { INotificationBuilder } from '@core/contracts';
import { CollaborationPostCommentEventPayload } from '@alkemio/notifications-lib';
import { CollaborationPostCommentEmailPayload } from '@common/email-template-payload';
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
export class CollaborationPostCommentNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly notificationBuilder: NotificationBuilder<
      CollaborationPostCommentEventPayload,
      CollaborationPostCommentEmailPayload
    >,
    @Inject(ALKEMIO_URL_GENERATOR)
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator
  ) {}
  build(
    payload: CollaborationPostCommentEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'owner',
        preferenceType: UserPreferenceType.NotificationPostCommentCreated,
        emailTemplate: EmailTemplate.COLLABORATION_POST_COMMENT_OWNER,
      },
    ];

    const templateVariables = {
      ownerID: payload.post.createdBy,
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.comment.createdBy,
      roleConfig,
      templateType: 'collaboration_post_comment',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  createTemplatePayload(
    eventPayload: CollaborationPostCommentEventPayload,
    recipient: User,
    commentAuthor?: User
  ): CollaborationPostCommentEmailPayload {
    if (!commentAuthor) {
      throw Error(
        `Comment author not provided for '${NotificationEventType.COLLABORATION_POST_COMMENT} event'`
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
    const postURL = this.alkemioUrlGenerator.createPostURL(
      journeyURL,
      eventPayload.callout.nameID,
      eventPayload.post.nameID
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
      post: {
        displayName: eventPayload.post.displayName,
        url: postURL,
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
    };
  }
}
