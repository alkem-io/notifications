import { Injectable } from '@nestjs/common';
import { CommunicationUserMentionEventPayload } from '@alkemio/notifications-lib';
import { CalloutPublishedInAppNotificationBuilder } from '../builders/in-app';
import { BaseEventSubject } from './base.event.subject';

@Injectable()
export class ContributorMentionedEventSubject extends BaseEventSubject<CommunicationUserMentionEventPayload> {
  constructor(
    private readonly inAppBuilder: CalloutPublishedInAppNotificationBuilder
  ) {
    super();
    this.registerBuilder(this.inAppBuilder);
  }
}
