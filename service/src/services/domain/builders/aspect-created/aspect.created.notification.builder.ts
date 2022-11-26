import { Inject, Injectable } from '@nestjs/common';
import { INotificationBuilder } from '@core/contracts';
import { AspectCreatedEventPayload } from '@alkemio/notifications-lib';
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
import { AspectCreatedEmailPayload } from '@common/email-template-payload';
import { NotificationEventType } from '@alkemio/notifications-lib';

@Injectable()
export class AspectCreatedNotificationBuilder implements INotificationBuilder {
  constructor(
    private readonly notificationBuilder: NotificationBuilder<
      AspectCreatedEventPayload,
      AspectCreatedEmailPayload
    >,
    @Inject(ALKEMIO_URL_GENERATOR)
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator
  ) {}
  build(
    payload: AspectCreatedEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'admin',
        preferenceType: UserPreferenceType.NotificationAspectCreatedAdmin,
        emailTemplate: EmailTemplate.ASPECT_CREATED_ADMIN,
      },
      {
        role: 'user',
        preferenceType: UserPreferenceType.NotificationAspectCreated,
        emailTemplate: EmailTemplate.ASPECT_CREATED_MEMBER,
      },
    ];

    const templateVariables = {
      hubID: payload.hub.id,
      challengeID: payload.hub?.challenge?.id ?? '',
      opportunityID: payload.hub?.challenge?.opportunity?.id ?? '',
      entityID:
        payload.hub?.challenge?.opportunity?.id ??
        payload.hub?.challenge?.id ??
        payload.hub.id,
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.aspect.createdBy,
      roleConfig,
      templateType: 'aspect_created',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  createTemplatePayload(
    eventPayload: AspectCreatedEventPayload,
    recipient: User,
    creator?: User
  ): AspectCreatedEmailPayload {
    if (!creator) {
      throw Error(
        `Creator not provided for '${NotificationEventType.ASPECT_CREATED} event'`
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

    const hubURL = this.alkemioUrlGenerator.createHubURL();

    return {
      emailFrom: 'info@alkem.io',
      createdBy: {
        firstname: creator.firstName,
        email: creator.email,
      },
      aspect: {
        displayName: eventPayload.aspect.displayName,
      },
      recipient: {
        firstname: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      community: {
        name: eventPayload.community.name,
        url: communityURL,
      },
      hub: {
        url: hubURL,
      },
    };
  }
}
