import { Injectable, Inject } from '@nestjs/common';
import {
  ALKEMIO_URL_GENERATOR,
  COMMUNITY_APPLICATION_CREATED,
} from '@src/common';
import { INotificationBuilder } from '@core/contracts';
import { User } from '@core/models';
import { ApplicationCreatedEventPayload } from '@common/dto';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator';
import { NotificationBuilder, RoleConfig } from '@src/services/application';
import { NotificationTemplateType } from '@src/types';
import { UserPreferenceType } from '@alkemio/client-lib';
import { EmailTemplate } from '@common/enums/email.template';

@Injectable()
export class ApplicationCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    @Inject(ALKEMIO_URL_GENERATOR)
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<ApplicationCreatedEventPayload>
  ) {}

  build(
    payload: ApplicationCreatedEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'admin',
        preferenceType: UserPreferenceType.NotificationApplicationReceived,
        emailTemplate: EmailTemplate.USER_APPLICATION_ADMIN,
      },
      {
        role: 'applicant',
        emailTemplate: EmailTemplate.USER_APPLICATION_APPLICANT,
        preferenceType: UserPreferenceType.NotificationApplicationSubmitted,
      },
    ];

    const lookupMap = new Map([
      ['applicantID', payload.applicantID],
      ['hubID', payload.hub.id],
      ['challengeID', payload.hub.challenge?.id ?? ''],
      ['opportunityID', payload.hub.challenge?.opportunity?.id ?? ''],
    ]);

    return this.notificationBuilder
      .setPayload(payload)
      .setEventUser(payload.applicantID)
      .setRoleConfig(roleConfig)
      .setTemplateType('application_created')
      .setTemplateVariables(lookupMap)
      .setTemplateBuilderFn(this.createTemplatePayload.bind(this))
      .build();
  }

  createTemplatePayload(
    eventPayload: ApplicationCreatedEventPayload,
    recipient: User,
    applicant?: User
  ): Record<string, unknown> {
    if (!applicant) {
      throw Error(
        `Applicant not provided for '${COMMUNITY_APPLICATION_CREATED} event'`
      );
    }
    const applicantProfileURL = this.alkemioUrlGenerator.createUserURL(
      applicant.nameID
    );
    const communityURL = this.alkemioUrlGenerator.createCommunityURL(
      eventPayload.hub.nameID,
      eventPayload.hub.challenge?.nameID,
      eventPayload.hub.challenge?.opportunity?.nameID
    );
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(
        recipient.nameID
      );
    const hubURL = this.alkemioUrlGenerator.createHubURL();
    return {
      emailFrom: 'info@alkem.io',
      applicant: {
        name: applicant.displayName,
        email: applicant.email,
        profile: applicantProfileURL,
      },
      recipient: {
        name: recipient.displayName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      community: {
        name: eventPayload.community.name,
        type: eventPayload.community.type,
        url: communityURL,
      },
      hub: {
        url: hubURL,
      },
      event: eventPayload,
    };
  }
}
