import { Injectable } from '@nestjs/common';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { INotificationBuilder } from '@core/contracts';
import { PlatformUser, User } from '@core/models';
import { CommunityApplicationCreatedEventPayload } from '@alkemio/notifications-lib';
import { NotificationBuilder, RoleConfig } from '../../../application';
import { NotificationTemplateType } from '@src/types';
import { PreferenceType } from '@alkemio/client-lib';
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
        preferenceType: PreferenceType.NotificationApplicationReceived,
        emailTemplate: EmailTemplate.COMMUNITY_USER_APPLICATION_ADMIN,
      },
      {
        role: 'applicant',
        emailTemplate: EmailTemplate.COMMUNITY_USER_APPLICATION_APPLICANT,
        preferenceType: PreferenceType.NotificationApplicationSubmitted,
      },
    ];

    const templateVariables = {
      applicantID: payload.applicant.id,
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
    recipient: User | PlatformUser,
    applicant?: User
  ): CommunityApplicationCreatedEmailPayload {
    if (!applicant) {
      throw Error(
        `Applicant not provided for '${NotificationEventType.COMMUNITY_APPLICATION_CREATED} event'`
      );
    }

    const isLevel0Space = eventPayload.space.level === '0';
    const spaceType = isLevel0Space ? 'space' : 'subspace';

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);
    return {
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
        level: eventPayload.space.level,
        url: eventPayload.space.profile.url,
        type: spaceType,
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }
}
