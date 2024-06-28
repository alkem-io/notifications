import { Injectable } from '@nestjs/common';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { PlatformUser, User } from '@core/models';
import { CommunicationUserMentionEventPayload } from '@alkemio/notifications-lib';
import { INotificationBuilder } from '@core/contracts/notification.builder.interface';
import { NotificationBuilder, RoleConfig } from '../../../application';
import { EmailTemplate } from '@common/enums/email.template';
import { NotificationTemplateType } from '@src/types/notification.template.type';
import { CommunicationUserMentionEmailPayload } from '@common/email-template-payload';
import { UserPreferenceType } from '@alkemio/client-lib';
import { convertMarkdownToText } from '@src/utils/markdown-to-text.util';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';

@Injectable()
export class CommunicationUserMentionNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<
      CommunicationUserMentionEventPayload,
      CommunicationUserMentionEmailPayload
    >
  ) {}

  build(
    payload: CommunicationUserMentionEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'receiver',
        emailTemplate: EmailTemplate.COMMUNICATION_COMMENT_MENTION_USER,
        preferenceType: UserPreferenceType.NotificationCommunicationMention,
      },
    ];

    const templateVariables = {
      senderID: payload.triggeredBy,
      receiverID: payload.mentionedUser.id,
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.triggeredBy,
      roleConfig,
      templateType: 'communication_user_mention',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  private createTemplatePayload(
    eventPayload: CommunicationUserMentionEventPayload,
    recipient: User | PlatformUser,
    sender?: User
  ): CommunicationUserMentionEmailPayload {
    if (!sender) {
      throw Error(
        `Sender not provided for '${NotificationEventType.COMMUNICATION_USER_MENTION}' event`
      );
    }
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);

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
        url: eventPayload.platform.url,
      },
      commentOrigin: {
        url: eventPayload.commentOrigin.url,
        displayName: eventPayload.commentOrigin.displayName,
      },
    };
  }
}
