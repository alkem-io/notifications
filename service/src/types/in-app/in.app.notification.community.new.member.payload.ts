import { InAppNotificationEventType } from '@src/generated/graphql';
import { InAppNotificationPayloadBase } from './in.app.notification.payload.base';

export interface InAppNotificationCommunityNewMemberPayload
  extends InAppNotificationPayloadBase {
  type: InAppNotificationEventType.CommunityNewMember;
  contributorType: string;
  newMemberID: string;
  spaceID: string;
}
