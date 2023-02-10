import { Inject, Injectable } from '@nestjs/common';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { User } from '@core/models';
import { CommunicationUserMentionEventPayload } from '@alkemio/notifications-lib';
import { INotificationBuilder } from '@core/contracts/notification.builder.interface';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator';
import { NotificationBuilder, RoleConfig } from '../../../application';
import { EmailTemplate } from '@common/enums/email.template';
import { NotificationTemplateType } from '@src/types/notification.template.type';
import { CommunicationUserMentionEmailPayload } from '@common/email-template-payload';
import { ALKEMIO_URL_GENERATOR } from '@src/common/enums/providers';
import { UserPreferenceType } from '@alkemio/client-lib';

@Injectable()
export class CommunicationUserMentionNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    @Inject(ALKEMIO_URL_GENERATOR)
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
    recipient: User,
    sender?: User
  ): CommunicationUserMentionEmailPayload {
    if (!sender) {
      throw Error(
        `Sender not provided for '${NotificationEventType.COMMUNICATION_USER_MENTION}' event`
      );
    }
    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(
        recipient.nameID
      );
    const alkemioURL = this.alkemioUrlGenerator.createPlatformURL();

    return {
      emailFrom: 'info@alkem.io',
      commentSender: {
        displayName: sender.displayName,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      comment: eventPayload.comment,
      platform: {
        url: alkemioURL,
      },
      mentionedUser: {
        displayName: eventPayload.mentionedUser.displayName,
      },
      commentOrigin: {
        url: eventPayload.commentOrigin.url,
        displayName: eventPayload.commentOrigin.displayName,
      },
    };
  }
}
