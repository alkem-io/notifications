import { NotificationTemplateType } from '@src/types';

export interface INotificationBuilder {
  build(payload: Record<string, unknown>): Promise<NotificationTemplateType[]>;
}
