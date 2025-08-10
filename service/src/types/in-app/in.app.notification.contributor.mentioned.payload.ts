import { InAppNotificationEventType } from '@src/generated/graphql';
import { InAppNotificationPayloadBase } from './in.app.notification.payload.base';

export interface InAppNotificationContributorMentionedPayload
  extends InAppNotificationPayloadBase {
  type: InAppNotificationEventType.CommunicationUserMention;
  comment: string; // probably will be removed; can be too large; can be replaced with roomID, commentID
  contributorType: string;
  commentOrigin: {
    displayName: string;
    url: string;
  };
}
