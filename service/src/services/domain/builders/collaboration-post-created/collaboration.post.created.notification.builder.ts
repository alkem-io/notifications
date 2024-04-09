import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '@core/contracts';
import { UserPreferenceType } from '@alkemio/client-lib';
import { NotificationBuilder, RoleConfig } from '@src/services/application';
import { NotificationTemplateType } from '@src/types';
import { ExternalUser, User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { CollaborationPostCreatedEmailPayload } from '@common/email-template-payload';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { CollaborationPostCreatedEventPayload } from '@alkemio/notifications-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';

@Injectable()
export class CollaborationPostCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly notificationBuilder: NotificationBuilder<
      CollaborationPostCreatedEventPayload,
      CollaborationPostCreatedEmailPayload
    >,
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator
  ) {}
  build(
    payload: CollaborationPostCreatedEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'admin',
        preferenceType: UserPreferenceType.NotificationPostCreatedAdmin,
        emailTemplate: EmailTemplate.COLLABORATION_POST_CREATED_ADMIN,
      },
      {
        role: 'user',
        preferenceType: UserPreferenceType.NotificationPostCreated,
        emailTemplate: EmailTemplate.COLLABORATION_POST_CREATED_MEMBER,
      },
    ];

    const templateVariables = {
      spaceID: payload.space.id,
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.post.createdBy,
      roleConfig,
      templateType: 'collaboration_post_created',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  createTemplatePayload(
    eventPayload: CollaborationPostCreatedEventPayload,
    recipient: User | ExternalUser,
    creator?: User
  ): CollaborationPostCreatedEmailPayload {
    if (!creator) {
      throw Error(
        `Creator not provided for '${NotificationEventType.COLLABORATION_POST_CREATED} event'`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);

    return {
      emailFrom: 'info@alkem.io',
      createdBy: {
        firstName: creator.firstName,
        email: creator.email,
      },
      callout: {
        displayName: eventPayload.callout.displayName,
        url: eventPayload.callout.url,
      },
      post: {
        displayName: eventPayload.post.displayName,
        url: eventPayload.post.url,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      journey: {
        displayName: eventPayload.space.profile.displayName,
        type: eventPayload.space.type,
        url: eventPayload.space.profile.url,
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }
}
