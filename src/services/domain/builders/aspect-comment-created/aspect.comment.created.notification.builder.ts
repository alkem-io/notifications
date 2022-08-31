import { Inject, Injectable } from '@nestjs/common';
import { UserPreferenceType } from '@alkemio/client-lib';
import { INotificationBuilder } from '@core/contracts';
import { AspectCommentCreatedEventPayload } from '@common/dto';
import {
  AlkemioUrlGenerator,
  NotificationBuilder,
  RoleConfig,
} from '@src/services/application';
import { NotificationTemplateType } from '@src/types';
import { EmailTemplate } from '@common/enums/email.template';
import { User } from '@core/models';
import { ALKEMIO_URL_GENERATOR, COMMENT_CREATED_ON_ASPECT } from '@src/common';

@Injectable()
export class AspectCommentCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly notificationBuilder: NotificationBuilder<AspectCommentCreatedEventPayload>,
    @Inject(ALKEMIO_URL_GENERATOR)
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator
  ) {}
  build(
    payload: AspectCommentCreatedEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'owner',
        preferenceType: UserPreferenceType.NotificationAspectCommentCreated,
        emailTemplate: EmailTemplate.ASPECT_COMMENT_CREATED_MEMBER,
      },
    ];

    const templateVariables = {
      ownerID: payload.aspect.createdBy,
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
    eventPayload: AspectCommentCreatedEventPayload,
    recipient: User,
    commentAuthor?: User
  ): Record<string, unknown> {
    if (!commentAuthor) {
      throw Error(
        `Comment author not provided for '${COMMENT_CREATED_ON_ASPECT} event'`
      );
    }
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(
        recipient.nameID
      );

    const communityURL = this.alkemioUrlGenerator.createCommunityURL(
      eventPayload.hub.nameID,
      eventPayload.hub.challenge?.nameID,
      eventPayload.hub.challenge?.opportunity?.nameID
    );

    return {
      emailFrom: 'info@alkem.io',
      aspect: {
        displayName: eventPayload.aspect.displayName,
      },
      recipient: {
        name: recipient.displayName,
        firstname: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      createdBy: {
        name: commentAuthor.displayName,
        firstname: commentAuthor.firstName,
        email: commentAuthor.email,
      },
      community: {
        name: eventPayload.community.name,
        url: communityURL,
      },
    };
  }
}
