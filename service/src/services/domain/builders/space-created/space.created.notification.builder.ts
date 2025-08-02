import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '@core/contracts';
import { NotificationTemplateType } from '@src/types';
import { SpaceCreatedEventPayload } from '@alkemio/notifications-lib';
import { EmailTemplate } from '@src/common/enums/email.template';
import {
  AlkemioUrlGenerator,
  NotificationBuilder,
  RoleConfig,
} from '../../../application';
import { PlatformUser, User } from '@src/core/models';
import { SpaceCreatedEmailPayload } from '@src/common/email-template-payload';

@Injectable()
export class SpaceCreatedNotificationBuilder implements INotificationBuilder {
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<
      SpaceCreatedEventPayload,
      SpaceCreatedEmailPayload
    >
  ) {}

  build(
    payload: SpaceCreatedEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'licenseManager',
        emailTemplate: EmailTemplate.SPACE_CREATED_ADMIN,
      },
    ];

    const templateVariables = {
      spaceID: payload.space.id,
      senderID: payload.triggeredBy,
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: undefined,
      roleConfig,
      templateType: 'space_created',
      templateVariables,
      templatePayloadBuilderFn: this.createEmailTemplatePayload.bind(this),
    });
  }

  createEmailTemplatePayload(
    eventPayload: SpaceCreatedEventPayload,
    recipient: User | PlatformUser
  ): SpaceCreatedEmailPayload {
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);

    return {
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
      sender: eventPayload.sender,
      dateCreated: new Date(eventPayload.created).toLocaleString('en-GB', {
        timeZone: 'UTC',
      }),
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }
}
