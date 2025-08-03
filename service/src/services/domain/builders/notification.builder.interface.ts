import {
  BaseEventPayload,
  InAppNotificationCategory,
  InAppNotificationPayloadBase,
} from '@alkemio/notifications-lib';
import { PlatformUser, User } from '../../../core/models/user';
import { BaseEmailPayload } from '@src/common/email-template-payload';
import { EventRecipientsSet } from '../../../core/models/EvenRecipientsSet';

export interface INotificationBuilder {
  getEventRecipientSets(
    payload: BaseEventPayload
  ): Promise<EventRecipientsSet[]>;

  createEmailTemplatePayload(
    eventPayload: BaseEventPayload,
    recipient: User | PlatformUser,
    contributor?: User
  ): BaseEmailPayload;

  createInAppTemplatePayload(
    eventPayload: BaseEventPayload,
    category: InAppNotificationCategory,
    receiverIDs: string[]
  ): InAppNotificationPayloadBase;
}
