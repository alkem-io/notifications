import { Injectable } from '@nestjs/common';
import {
  InAppNotificationCategory,
  InAppNotificationPayloadBase,
  NotificationEventType,
} from '@alkemio/notifications-lib';
import { PlatformUser, User } from '@core/models';
import { INotificationBuilder } from '@core/contracts/notification.builder.interface';
import { EmailTemplate } from '@common/enums/email.template';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator/alkemio.url.generator';
import { PlatformGlobalRoleChangeEmailPayload } from '@src/common/email-template-payload/platform.global.role.change.email.payload';
import { PlatformGlobalRoleChangeEventPayload } from '@alkemio/notifications-lib';
import { AlkemioClientAdapter } from '../../../application';
import { UserNotificationEvent } from '@src/generated/alkemio-schema';
import { EventRecipientsSet } from '@src/core/models/EvenRecipientsSet';

@Injectable()
export class PlatformGlobalRoleChangeNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly alkemioClientAdapter: AlkemioClientAdapter
  ) {}

  public async getEmailRecipientSets(
    payload: PlatformGlobalRoleChangeEventPayload
  ): Promise<EventRecipientsSet[]> {
    const globalAdminRecipients = await this.alkemioClientAdapter.getRecipients(
      UserNotificationEvent.PlatformNewUserSignUp,
      '',
      payload.triggeredBy
    );

    const emailRecipientsSets: EventRecipientsSet[] = [
      {
        emailRecipients: globalAdminRecipients.emailRecipients,
        inAppRecipients: globalAdminRecipients.inAppRecipients,
        emailTemplate: EmailTemplate.PLATFORM_GLOBAL_ROLE_CHANGE_ADMIN,
      },
    ];
    return emailRecipientsSets;
  }

  public createEmailTemplatePayload(
    eventPayload: PlatformGlobalRoleChangeEventPayload,
    recipient: User | PlatformUser,
    user?: User
  ): PlatformGlobalRoleChangeEmailPayload {
    if (!user) {
      throw Error(
        `User not provided for '${NotificationEventType.PLATFORM_GLOBAL_ROLE_CHANGE}' event`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);
    return {
      user: {
        displayName: user.profile.displayName,
        firstName: user.firstName,
        email: user.email,
        profile: user.profile.url,
      },
      actor: {
        displayName: eventPayload.actor.profile.displayName,
        url: eventPayload.actor.profile.url,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      role: eventPayload.role,
      type: eventPayload.type,
      platform: {
        url: eventPayload.platform.url,
      },
      triggeredBy: eventPayload.triggeredBy,
    };
  }

  createInAppTemplatePayload(
    eventPayload: PlatformGlobalRoleChangeEventPayload,
    category: InAppNotificationCategory,
    receiverIDs: string[]
  ): InAppNotificationPayloadBase {
    return {
      type: NotificationEventType.PLATFORM_GLOBAL_ROLE_CHANGE,
      triggeredAt: new Date(),
      receiverIDs,
      category,
      triggeredByID: eventPayload.triggeredBy,
      receiverID: receiverIDs[0], // For individual notifications
    };
  }
}
