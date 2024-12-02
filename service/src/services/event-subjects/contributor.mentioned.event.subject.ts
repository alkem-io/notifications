import { Injectable } from '@nestjs/common';
import { CommunicationUserMentionEventPayload } from '@alkemio/notifications-lib';
import { EventSubject } from './event.subject';
import { NotificationBuilder } from '../builders';
import { ContributorMentionedInAppNotificationBuilder } from '../builders/in-app';

@Injectable()
export class ContributorMentionedEventSubject implements EventSubject {
  private readonly builders: NotificationBuilder[];
  constructor(
    private readonly inAppBuilder: ContributorMentionedInAppNotificationBuilder
  ) {
    this.builders = [this.inAppBuilder];
  }

  notifyAll(event: CommunicationUserMentionEventPayload): void {
    this.builders.forEach(builder => builder.buildAndSend(event));
  }
}
