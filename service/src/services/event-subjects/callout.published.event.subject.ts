import { CollaborationCalloutPublishedEventPayload } from '@alkemio/notifications-lib';
import { Injectable } from '@nestjs/common';
import { EventSubject } from './event.subject';
import { NotificationBuilder } from '../builders';
import { CalloutPublishedInAppNotificationBuilder } from '../builders/in-app';

@Injectable()
export class CalloutPublishedEventSubject implements EventSubject {
  private readonly builders: NotificationBuilder[];
  constructor(
    private readonly inAppBuilder: CalloutPublishedInAppNotificationBuilder
  ) {
    this.builders = [this.inAppBuilder];
  }

  notifyAll(event: CollaborationCalloutPublishedEventPayload): void {
    this.builders.forEach(builder => builder.buildAndSend(event));
  }
}
