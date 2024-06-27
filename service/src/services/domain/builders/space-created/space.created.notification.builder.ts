import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '@core/contracts';
import { NotificationTemplateType } from '@src/types';
import {
  NotificationEventType,
  SpacePayload,
  // SpaceCreatedEventPayload,
} from '@alkemio/notifications-lib'; // Import or define the type 'SpaceCreatedEventPayload'
// import { User } from '@alkemio/client-lib';
import { EmailTemplate } from '@src/common/enums/email.template';
import {
  AlkemioUrlGenerator,
  NotificationBuilder,
  RoleConfig,
} from '../../../application';
import { ExternalUser, User } from '@src/core/models';
import { SpaceCreatedEmailPayload } from '@src/common/email-template-payload';

@Injectable()
export class SpaceCreatedNotificationBuilder implements INotificationBuilder {
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<
      //SpaceCreatedEventPayload,
      {
        host: string;
        plan: string;
        space: SpacePayload;
        triggeredBy: string;
        platform: {
          url: string;
        };
      },
      SpaceCreatedEmailPayload
    >
  ) {}

  build(
    payload: {
      host: string;
      plan: string;
      space: SpacePayload;
      triggeredBy: string;
      platform: {
        url: string;
      };
    } //SpaceCreatedEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'license manager',
        emailTemplate: EmailTemplate.SPACE_CREATED_ADMIN,
      },
    ];

    const templateVariables = {
      spaceID: payload.space.id,
      hostID: payload.host,
    };

    return this.notificationBuilder.build({
      payload,
      // eventUserId: payload.user.id,
      roleConfig,
      templateType: 'space_created',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  createTemplatePayload(
    eventPayload: {
      host: string;
      plan: string;
      space: SpacePayload;
      triggeredBy: string;
      platform: {
        url: string;
      };
    }, //SpaceCreatedEventPayload,
    recipient: User | ExternalUser,
    sender?: User
  ): SpaceCreatedEmailPayload {
    if (!sender) {
      throw Error(
        `Sender not provided for '${NotificationEventType.SPACE_CREATED}' event`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);

    return {
      emailFrom: 'info@alkem.io',
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      host: 'name',
      space: {
        displayName: eventPayload.space.profile.displayName,
        type: eventPayload.space.type,
        url: eventPayload.space.profile.url,
        dateCreated: 'string',
        timeCreated: 'string',
        plan: 'string',
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }
}
