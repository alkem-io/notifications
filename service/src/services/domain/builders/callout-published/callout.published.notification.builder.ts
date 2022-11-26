import { Inject, Injectable } from '@nestjs/common';
import { INotificationBuilder } from '@core/contracts';
import {
  AlkemioUrlGenerator,
  NotificationBuilder,
  RoleConfig,
} from '@src/services/application';
import { NotificationTemplateType } from '@src/types';
import { UserPreferenceType } from '@alkemio/client-lib';
import { User } from '@core/models';
import { ALKEMIO_URL_GENERATOR } from '@common/enums';
import { EmailTemplate } from '@common/enums/email.template';
import { CalloutPublishedEventPayload } from '@common/dto';
import { CalloutPublishedEmailPayload } from '@common/email-template-payload';
import { CALLOUT_PUBLISHED } from '@src/common/constants';

@Injectable()
export class CalloutPublishedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly notificationBuilder: NotificationBuilder<
      CalloutPublishedEventPayload,
      CalloutPublishedEmailPayload
    >,
    @Inject(ALKEMIO_URL_GENERATOR)
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator
  ) {}
  build(
    payload: CalloutPublishedEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'user',
        preferenceType: UserPreferenceType.NotificationCalloutPublished,
        emailTemplate: EmailTemplate.CALLOUT_PUBLISHED_MEMBER,
      },
    ];

    const templateVariables = {
      entityID:
        payload.hub?.challenge?.opportunity?.id ??
        payload.hub?.challenge?.id ??
        payload.hub.id,
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.userID,
      roleConfig,
      templateType: 'callout_published',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  createTemplatePayload(
    eventPayload: CalloutPublishedEventPayload,
    recipient: User,
    creator?: User
  ): CalloutPublishedEmailPayload {
    if (!creator) {
      throw Error(`Creator not provided for '${CALLOUT_PUBLISHED} event'`);
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

    const alkemioUrl = this.alkemioUrlGenerator.createHubURL();

    return {
      emailFrom: 'info@alkem.io',
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
      },
      community: {
        name: eventPayload.community.name,
        url: communityURL,
      },
      hub: {
        url: alkemioUrl,
      },
    };
  }
}
