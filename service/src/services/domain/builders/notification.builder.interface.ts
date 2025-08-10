import { BaseEventPayload } from '@alkemio/notifications-lib';
import { PlatformUser, User } from '../../../core/models/user';
import { BaseEmailPayload } from '@src/common/email-template-payload';
import { EventRecipientsSet } from '../../../core/models/EvenRecipientsSet';
import { InAppNotificationCategory } from '@src/generated/graphql';
import { InAppNotificationPayloadBase } from '@src/types/in-app/in.app.notification.payload.base';

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
