import { BaseEventPayload } from '@alkemio/notifications-lib';
import { PlatformUser, User } from '../../../core/models/user';
import { BaseEmailPayload } from '@src/common/email-template-payload';
export interface INotificationBuilder {
  createEmailTemplatePayload(
    eventPayload: BaseEventPayload,
    recipient: User | PlatformUser
  ): BaseEmailPayload;
}
