import { BaseEventPayload } from '@alkemio/notifications-lib';

export interface EventSubject {
  notifyAll(event: BaseEventPayload): void;
}
