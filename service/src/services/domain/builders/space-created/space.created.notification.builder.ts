import { Inject, Injectable } from '@nestjs/common';
import { INotificationBuilder } from '@core/contracts';
import { NotificationTemplateType } from '@src/types';
import {
  CommentReplyEventPayload,
  NotificationEventType,
  SpaceCreatedEventPayload,
} from '@alkemio/notifications-lib'; // Import or define the type 'SpaceCreatedEventPayload'
import { User, UserPreferenceType } from '@alkemio/client-lib';
import { EmailTemplate } from '@src/common/enums/email.template';
import {
  AlkemioUrlGenerator,
  NotificationBuilder,
  RoleConfig,
} from '../../../application';
import { ExternalUser } from '@src/core/models';
import { CommentReplyEmailPayload } from '@src/common/email-template-payload';

@Injectable()
export class SpaceCreatedNotificationBuilder implements INotificationBuilder {
  constructor(
    @Inject(ALKEMIO_URL_GENERATOR)
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<any, any>
  ) {}

  build(
    payload: SpaceCreatedEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'license manager',
        preferenceType: UserPreferenceType.NotificationPostCreatedAdmin,
        emailTemplate: EmailTemplate.SPACE_CREATED_ADMIN,
      },
    ];

    const templateVariables = {
      spaceID: payload.space.id,
    };

    return this.notificationBuilder.build({
      payload,
      roleConfig,
      templateType: 'space_created',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  createTemplatePayload(
    eventPayload: CommentReplyEventPayload,
    recipient: User | ExternalUser,
    sender?: User
  ): CommentReplyEmailPayload {
    if (!sender) {
      throw Error(
        `Sender not provided for '${NotificationEventType.SPACE_CREATED}' event`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);

    return {
      emailFrom: 'info@alkem.io',
      reply: {
        message: eventPayload.reply,
        createdBy: sender.profile.displayName,
        createdByUrl: sender.profile.url,
      },
      comment: eventPayload.comment,
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }
}
