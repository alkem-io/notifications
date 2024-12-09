import { BaseEventPayload } from '@alkemio/notifications-lib';
import { NotificationBuilder } from '@src/services/builders';
import { EventSubject } from './event.subject';

export abstract class BaseEventSubject<T extends BaseEventPayload>
  implements EventSubject
{
  protected readonly builders: NotificationBuilder[] = [];

  protected registerBuilders(builders: NotificationBuilder[]): void {
    this.builders.push(...builders);
  }

  notifyAll(event: T): void {
    this.builders.forEach(builder => builder.buildAndSend(event));
  }
}
