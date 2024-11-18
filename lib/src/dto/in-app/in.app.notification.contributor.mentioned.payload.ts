import { CommunityContributorType } from "@alkemio/client-lib";
import { InAppNotificationPayload } from "./in.app.notification.payload";

export interface InAppNotificationContributorMentionedPayload extends InAppNotificationPayload {
  comment: string; // probably will be removed; can be too large; can be replaced with roomID, commentID
  mentionedContributorID: string;
  contributorType: CommunityContributorType
  commentOrigin: {
    type: string; // forum, reply, event, post, callout
    url: string;
  }
}
