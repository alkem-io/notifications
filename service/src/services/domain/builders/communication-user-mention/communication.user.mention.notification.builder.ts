import { Injectable } from '@nestjs/common';
import {
  InAppNotificationCategory,
  InAppNotificationPayloadBase,
  NotificationEventType,
} from '@alkemio/notifications-lib';
import { PlatformUser, User } from '@core/models';
import { CommunicationUserMentionEventPayload } from '@alkemio/notifications-lib';
import { INotificationBuilder } from '@core/contracts/notification.builder.interface';
import { EmailTemplate } from '@common/enums/email.template';
import { CommunicationUserMentionEmailPayload } from '@common/email-template-payload';
import { convertMarkdownToText } from '@src/utils/markdown-to-text.util';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { AlkemioClientAdapter } from '@src/services/application/alkemio-client-adapter';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import { EventRecipientsSet } from '@src/core/models/EvenRecipientsSet';

@Injectable()
export class CommunicationUserMentionNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly alkemioClientAdapter: AlkemioClientAdapter
  ) {}

  public async getEventRecipientSets(
    payload: CommunicationUserMentionEventPayload
  ): Promise<EventRecipientsSet[]> {
    const userMentionRecipients = await this.alkemioClientAdapter.getRecipients(
      UserNotificationEvent.SpaceCommunicationMention,
      undefined, // User mention doesn't have space ID directly
      payload.triggeredBy
    );

    const emailRecipientsSets: EventRecipientsSet[] = [
      {
        emailRecipients: userMentionRecipients.emailRecipients,
        inAppRecipients: userMentionRecipients.inAppRecipients,
        emailTemplate: EmailTemplate.COMMUNICATION_COMMENT_MENTION_USER,
      },
    ];
    return emailRecipientsSets;
  }

  public createEmailTemplatePayload(
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

  public createInAppTemplatePayload(
    eventPayload: CommunicationUserMentionEventPayload,
    category: InAppNotificationCategory,
    receiverIDs: string[]
  ): InAppNotificationPayloadBase {
    const { triggeredBy: triggeredByID } = eventPayload;

    return {
      type: NotificationEventType.COMMUNICATION_USER_MENTION,
      triggeredAt: new Date(),
      receiverIDs,
      category,
      triggeredByID,
      receiverID: '',
    };
  }
}
