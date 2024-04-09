import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '@core/contracts';
import { CollaborationWhiteboardCreatedEventPayload } from '@alkemio/notifications-lib';
import { UserPreferenceType } from '@alkemio/client-lib';
import { NotificationBuilder, RoleConfig } from '@src/services/application';
import { NotificationTemplateType } from '@src/types';
import { ExternalUser, User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { CollaborationWhiteboardCreatedEmailPayload } from '@common/email-template-payload';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';

@Injectable()
export class CollaborationWhiteboardCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly notificationBuilder: NotificationBuilder<
      CollaborationWhiteboardCreatedEventPayload,
      CollaborationWhiteboardCreatedEmailPayload
    >,
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator
  ) {}
  build(
    payload: CollaborationWhiteboardCreatedEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'admin',
        preferenceType: UserPreferenceType.NotificationWhiteboardCreated,
        emailTemplate: EmailTemplate.COLLABORATION_WHITEBOARD_CREATED_ADMIN,
      },
      {
        role: 'user',
        preferenceType: UserPreferenceType.NotificationWhiteboardCreated,
        emailTemplate: EmailTemplate.COLLABORATION_WHITEBOARD_CREATED_MEMBER,
      },
    ];

    const templateVariables = {
      spaceID: payload.space.id,
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.whiteboard.createdBy,
      roleConfig,
      templateType: 'collaboration_whiteboard_created',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  createTemplatePayload(
    eventPayload: CollaborationWhiteboardCreatedEventPayload,
    recipient: User | ExternalUser,
    creator?: User
  ): CollaborationWhiteboardCreatedEmailPayload {
    if (!creator) {
      throw Error(
        `Creator not provided for '${NotificationEventType.COLLABORATION_WHITEBOARD_CREATED} event'`
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
      whiteboard: {
        displayName: eventPayload.whiteboard.displayName,
        url: eventPayload.whiteboard.url,
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
