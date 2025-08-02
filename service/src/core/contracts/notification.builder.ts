import { BaseEventPayload } from '@alkemio/notifications-lib';

export interface NotificationBuilder {
  buildAndSend(event: BaseEventPayload): Promise<void>;
}
