import { BaseEventPayload } from '@alkemio/notifications-lib';
import { PlatformUser, User } from '../models/user';
import { BaseEmailPayload } from '@src/common/email-template-payload';
import { EventEmailRecipients } from '../models/EventEmailRecipients';

export interface INotificationBuilder {
  getEmailRecipientSets(
    payload: BaseEventPayload
  ): Promise<EventEmailRecipients[]>;

  createEmailTemplatePayload(
    eventPayload: BaseEventPayload,
    recipient: User | PlatformUser
  ): BaseEmailPayload;
}
