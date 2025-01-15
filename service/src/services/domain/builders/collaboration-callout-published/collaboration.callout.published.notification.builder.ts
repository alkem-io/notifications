import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '@core/contracts';
import { NotificationBuilder, RoleConfig } from '@src/services/application';
import { NotificationTemplateType } from '@src/types';
import { PreferenceType } from '@alkemio/client-lib';
import { PlatformUser, User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { CollaborationCalloutPublishedEventPayload } from '@alkemio/notifications-lib';
import { CollaborationCalloutPublishedEmailPayload } from '@common/email-template-payload';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';

@Injectable()
export class CollaborationCalloutPublishedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly notificationBuilder: NotificationBuilder<
      CollaborationCalloutPublishedEventPayload,
      CollaborationCalloutPublishedEmailPayload
    >,
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator
  ) {}
  build(
    payload: CollaborationCalloutPublishedEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'user',
        preferenceType: PreferenceType.NotificationCalloutPublished,
        emailTemplate: EmailTemplate.COLLABORATION_CALLOUT_PUBLISHED_MEMBER,
      },
    ];

    const templateVariables = {
      spaceID: payload.space.id,
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.triggeredBy,
      roleConfig,
      templateType: 'collaboration_callout_published',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  createTemplatePayload(
    eventPayload: CollaborationCalloutPublishedEventPayload,
    recipient: User | PlatformUser,
    creator?: User
  ): CollaborationCalloutPublishedEmailPayload {
    if (!creator) {
      throw Error(
        `Creator not provided for '${NotificationEventType.COLLABORATION_CALLOUT_PUBLISHED} event'`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);

    const calloutURL = eventPayload.callout.url;

    const result: CollaborationCalloutPublishedEmailPayload = {
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      publishedBy: {
        firstName: creator.firstName,
      },
      callout: {
        displayName: eventPayload.callout.displayName,
        url: calloutURL,
        type: eventPayload.callout.type,
      },
      space: {
        displayName: eventPayload.space.profile.displayName,
        type: eventPayload.space.type,
        url: eventPayload.space.profile.url,
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
    return result;
  }
}
