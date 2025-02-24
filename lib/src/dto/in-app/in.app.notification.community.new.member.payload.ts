import { RoleSetContributorType } from '@alkemio/client-lib';
import { InAppNotificationPayloadBase } from './in.app.notification.payload.base';
import { NotificationEventType } from '../../notification.event.type';

export interface InAppNotificationCommunityNewMemberPayload extends InAppNotificationPayloadBase {
  type: NotificationEventType.COMMUNITY_NEW_MEMBER;
  contributorType: RoleSetContributorType;
  newMemberID: string;
  spaceID: string;
}
