import { NotificationTemplateType } from '@src/types';
import { BaseEventPayload } from '@alkemio/notifications-lib/src/dto';

export interface INotificationBuilder {
  build(payload: BaseEventPayload): Promise<NotificationTemplateType[]>;
}
