import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '@core/contracts';
import { PlatformUser, User } from '@core/models';
import { EmailTemplate } from '@common/enums/email.template';
import { PlatformForumDiscussionCreatedEventPayload } from '@alkemio/notifications-lib';
import { UserPreferenceType } from '@alkemio/client-lib';
import { NotificationBuilder, RoleConfig } from '../../../application';
import { NotificationTemplateType } from '@src/types';
import { PlatformForumDiscussionCreatedEmailPayload } from '@common/email-template-payload';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';

@Injectable()
export class PlatformForumDiscussionCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<
      PlatformForumDiscussionCreatedEventPayload,
      PlatformForumDiscussionCreatedEmailPayload
    >
  ) {}

  build(
    payload: PlatformForumDiscussionCreatedEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'user',
        emailTemplate: EmailTemplate.PLATFORM_FORUM_DISCUSSION_CREATED,
        preferenceType: UserPreferenceType.NotificationForumDiscussionCreated,
      },
    ];

    const templateVariables = undefined;

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.discussion.createdBy,
      roleConfig,
      templateType: 'platform_forum_discussion_created',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  createTemplatePayload(
    eventPayload: PlatformForumDiscussionCreatedEventPayload,
    recipient: User | PlatformUser,
    sender?: User
  ): PlatformForumDiscussionCreatedEmailPayload {
    if (!sender) {
      throw Error(
        `Sender not provided for '${NotificationEventType.PLATFORM_FORUM_DISCUSSION_CREATED}' event`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);
    return {
      createdBy: {
        firstName: sender.firstName,
      },
      discussion: {
        displayName: eventPayload.discussion.displayName,
        url: eventPayload.discussion.url,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      platform: {
        url: eventPayload.platform.url,
      },
    };
  }
}
