import { Inject, Injectable } from '@nestjs/common';
import { INotificationBuilder } from '@core/contracts';
import { AspectCreatedEventPayload } from '@common/dto';
import {
  AlkemioUrlGenerator,
  NotificationBuilder,
  RoleConfig,
} from '@src/services/application';
import { NotificationTemplateType } from '@src/types';
import { UserPreferenceType } from '@alkemio/client-lib';
import { User } from '@core/models';
import { ALKEMIO_URL_GENERATOR, ASPECT_CREATED } from '@src/common';
import { EmailTemplate } from '@common/enums/email.template';

@Injectable()
export class AspectCreatedNotificationBuilder implements INotificationBuilder {
  constructor(
    private readonly notificationBuilder: NotificationBuilder<AspectCreatedEventPayload>,
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
  ): Record<string, unknown> {
    if (!creator) {
      throw Error(`Creator not provided for '${ASPECT_CREATED} event'`);
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
      createdBy: {
        name: creator.displayName,
        firstname: creator.firstName,
        email: creator.email,
      },
      aspect: {
        displayName: eventPayload.aspect.displayName,
      },
      recipient: {
        name: recipient.displayName,
        firstname: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      community: {
        name: eventPayload.community.name,
        url: communityURL,
      },
    };
  }
}
