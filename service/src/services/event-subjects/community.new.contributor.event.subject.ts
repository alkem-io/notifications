import { Injectable } from '@nestjs/common';
import { CommunityNewMemberPayload } from '@alkemio/notifications-lib';
import { CommunityNewContributorInAppNotificationBuilder } from '../builders/in-app';
import { BaseEventSubject } from './base.event.subject';

@Injectable()
export class CommunityNewContributorEventSubject extends BaseEventSubject<CommunityNewMemberPayload> {
  constructor(
    private readonly newContributorBuilder: CommunityNewContributorInAppNotificationBuilder
  ) {
    super();
    this.registerBuilders([this.newContributorBuilder]);
  }
}
