import { RoleSetContributorType } from "@alkemio/client-lib";
import { InAppNotificationPayloadBase } from "./in.app.notification.payload.base";
import { NotificationEventType } from '../../notification.event.type';

export interface InAppNotificationContributorMentionedPayload extends InAppNotificationPayloadBase {
  type: NotificationEventType.COMMUNICATION_USER_MENTION;
  comment: string; // probably will be removed; can be too large; can be replaced with roomID, commentID
  contributorType: RoleSetContributorType
  commentOrigin: {
    displayName: string;
    url: string;
  }
}
