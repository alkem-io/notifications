import { NotificationTemplateType } from '@src/types/notification.template.type';

export interface INotificationBuilder {
  build(payload: Record<string, unknown>): Promise<NotificationTemplateType[]>;
}
