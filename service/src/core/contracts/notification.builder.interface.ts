import { NotificationTemplateType } from '@src/types';
import { BaseEventPayload } from '@alkemio/notifications-lib/dist/dto';

export interface INotificationBuilder {
  build(payload: BaseEventPayload): Promise<NotificationTemplateType[]>;
}
