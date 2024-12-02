import { Injectable } from '@nestjs/common';
import { CommunityNewMemberPayload } from '@alkemio/notifications-lib';
import { EventSubject } from './event.subject';
import { NotificationBuilder } from '../builders';
import { CommunityNewContributorInAppNotificationBuilder } from '../builders/in-app';

@Injectable()
export class CommunityNewContributorEventSubject implements EventSubject {
  private readonly builders: NotificationBuilder[];
  constructor(
    private readonly inAppBuilder: CommunityNewContributorInAppNotificationBuilder
  ) {
    this.builders = [this.inAppBuilder];
  }

  notifyAll(event: CommunityNewMemberPayload): void {
    this.builders.forEach(builder => builder.buildAndSend(event));
  }
}
