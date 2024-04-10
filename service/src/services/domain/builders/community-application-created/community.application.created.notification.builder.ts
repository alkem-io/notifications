import { Injectable } from '@nestjs/common';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { INotificationBuilder } from '@core/contracts';
import { ExternalUser, User } from '@core/models';
import { CommunityApplicationCreatedEventPayload } from '@alkemio/notifications-lib';
import { NotificationBuilder, RoleConfig } from '../../../application';
import { NotificationTemplateType } from '@src/types';
import { UserPreferenceType } from '@alkemio/client-lib';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunityApplicationCreatedEmailPayload } from '@common/email-template-payload';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';

@Injectable()
export class CommunityApplicationCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<
      CommunityApplicationCreatedEventPayload,
      CommunityApplicationCreatedEmailPayload
    >
  ) {}

  build(
    payload: CommunityApplicationCreatedEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'admin',
        preferenceType: UserPreferenceType.NotificationApplicationReceived,
        emailTemplate: EmailTemplate.COMMUNITY_USER_APPLICATION_ADMIN,
      },
      {
        role: 'applicant',
        emailTemplate: EmailTemplate.COMMUNITY_USER_APPLICATION_APPLICANT,
        preferenceType: UserPreferenceType.NotificationApplicationSubmitted,
      },
    ];

    const templateVariables = {
      applicantID: payload.applicant.profile.url,
      spaceID: payload.space.id,
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.applicant.id,
      roleConfig,
      templateType: 'community_application_created',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  private createTemplatePayload(
    eventPayload: CommunityApplicationCreatedEventPayload,
    recipient: User | ExternalUser,
    applicant?: User
  ): CommunityApplicationCreatedEmailPayload {
    if (!applicant) {
      throw Error(
        `Applicant not provided for '${NotificationEventType.COMMUNITY_APPLICATION_CREATED} event'`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);
    return {
      emailFrom: 'info@alkem.io',
      applicant: {
        firstName: applicant.firstName,
        name: applicant.profile.displayName,
        email: applicant.email,
        profile: applicant.profile.url,
      },
      spaceAdminURL: eventPayload.space.adminURL,
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
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
  }
}
