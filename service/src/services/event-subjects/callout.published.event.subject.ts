import { CollaborationCalloutPublishedEventPayload } from '@alkemio/notifications-lib';
import { Injectable } from '@nestjs/common';
import { CalloutPublishedInAppNotificationBuilder } from '../builders/in-app';
import { BaseEventSubject } from './base.event.subject';

@Injectable()
export class CalloutPublishedEventSubject extends BaseEventSubject<CollaborationCalloutPublishedEventPayload> {
  constructor(
    private readonly calloutPublishedBuilder: CalloutPublishedInAppNotificationBuilder
  ) {
    super();
    this.registerBuilders([this.calloutPublishedBuilder]);
  }
}
