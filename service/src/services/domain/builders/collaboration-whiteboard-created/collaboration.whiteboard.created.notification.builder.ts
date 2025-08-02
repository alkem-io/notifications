import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '@core/contracts';
import { CollaborationWhiteboardCreatedEventPayload } from '@alkemio/notifications-lib';
import { PreferenceType } from '@alkemio/client-lib';
import { NotificationBuilder, RoleConfig } from '@src/services/application';
import { NotificationTemplateType } from '@src/types';
import { PlatformUser, User } from '@core/models';
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
        preferenceType: PreferenceType.NotificationWhiteboardCreated,
        emailTemplate: EmailTemplate.COLLABORATION_WHITEBOARD_CREATED_ADMIN,
      },
      {
        role: 'user',
        preferenceType: PreferenceType.NotificationWhiteboardCreated,
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
      templatePayloadBuilderFn: this.createEmailTemplatePayload.bind(this),
    });
  }

  createEmailTemplatePayload(
    eventPayload: CollaborationWhiteboardCreatedEventPayload,
    recipient: User | PlatformUser,
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
      space: {
        displayName: eventPayload.space.profile.displayName,
        level: eventPayload.space.level,
        url: eventPayload.space.profile.url,
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }
}
