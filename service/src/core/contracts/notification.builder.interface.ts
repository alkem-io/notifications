import { NotificationTemplateType } from '@src/types';
import { BaseEventPayload } from '@common/dto';

export interface INotificationBuilder {
  build(payload: BaseEventPayload): Promise<NotificationTemplateType[]>;
}
