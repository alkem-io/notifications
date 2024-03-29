import { Inject, Injectable } from '@nestjs/common';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { ExternalUser, User } from '@core/models';
import { CommunicationOrganizationMentionEventPayload } from '@alkemio/notifications-lib';
import { INotificationBuilder } from '@core/contracts/notification.builder.interface';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator';
import { NotificationBuilder, RoleConfig } from '../../../application';
import { EmailTemplate } from '@common/enums/email.template';
import { NotificationTemplateType } from '@src/types/notification.template.type';
import { CommunicationOrganizationMentionEmailPayload } from '@common/email-template-payload';
import { ALKEMIO_URL_GENERATOR } from '@src/common/enums/providers';
import { UserPreferenceType } from '@alkemio/client-lib';
import { convertMarkdownToText } from '@src/utils/markdown-to-text.util';

@Injectable()
export class CommunicationOrganizationMentionNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    @Inject(ALKEMIO_URL_GENERATOR)
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<
      CommunicationOrganizationMentionEventPayload,
      CommunicationOrganizationMentionEmailPayload
    >
  ) {}

  build(
    payload: CommunicationOrganizationMentionEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'receiver',
        emailTemplate: EmailTemplate.COMMUNICATION_COMMENT_MENTION_ORGANIZATION,
        preferenceType: UserPreferenceType.NotificationOrganizationMention,
      },
    ];

    const templateVariables = {
      organizationID: payload.mentionedOrganization.id,
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.triggeredBy,
      roleConfig,
      templateType: 'communication_organization_mention',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  private createTemplatePayload(
    eventPayload: CommunicationOrganizationMentionEventPayload,
    recipient: User | ExternalUser,
    sender?: User
  ): CommunicationOrganizationMentionEmailPayload {
    if (!sender) {
      throw Error(
        `Sender not provided for '${NotificationEventType.COMMUNICATION_ORGANIZATION_MENTION}' event`
      );
    }
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);
    const alkemioURL = this.alkemioUrlGenerator.createPlatformURL();

    const htmlComment: string = convertMarkdownToText(eventPayload.comment);

    return {
      emailFrom: 'info@alkem.io',
      commentSender: {
        displayName: sender.profile.displayName,
        firstName: sender.firstName,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      comment: htmlComment,
      platform: {
        url: alkemioURL,
      },
      mentionedOrganization: {
        displayName: eventPayload.mentionedOrganization.displayName,
      },
      commentOrigin: {
        url: eventPayload.commentOrigin.url,
        displayName: eventPayload.commentOrigin.displayName,
      },
    };
  }
}
