import { PlatformUser, User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunityApplicationCreatedEmailPayload } from '@common/email-template-payload';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { SpaceCommunityApplicationCreatedEventPayload } from '@alkemio/notifications-lib';
import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '../notification.builder.interface';

@Injectable()
export class SpaceCommunityApplicationApplicantNotificationBuilder
  implements INotificationBuilder
{
  constructor(private readonly alkemioUrlGenerator: AlkemioUrlGenerator) {}

  emailTemplate = EmailTemplate.SPACE_COMMUNITY_USER_APPLICATION_APPLICANT;

  public createEmailTemplatePayload(
    eventPayload: SpaceCommunityApplicationCreatedEventPayload,
    recipient: User | PlatformUser,
    applicant?: User
  ): CommunityApplicationCreatedEmailPayload {
    if (!applicant) {
      throw Error(
        `Applicant not provided for '${eventPayload.eventType}' event`
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
