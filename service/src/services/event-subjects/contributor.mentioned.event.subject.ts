import { Injectable } from '@nestjs/common';
import { CommunicationUserMentionEventPayload } from '@alkemio/notifications-lib';
import { ContributorMentionedInAppNotificationBuilder } from '../builders/in-app';
import { BaseEventSubject } from './base.event.subject';

@Injectable()
export class ContributorMentionedEventSubject extends BaseEventSubject<CommunicationUserMentionEventPayload> {
  constructor(
    private readonly contributorMentionedBuilder: ContributorMentionedInAppNotificationBuilder
  ) {
    super();
    this.registerBuilders([this.contributorMentionedBuilder]);
  }
}
