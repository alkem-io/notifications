import { InAppNotificationCalloutPublishedPayload } from "./in.app.notification.callout.published.payload";
import { InAppNotificationCommunityNewMemberPayload } from "./in.app.notification.community.new.member.payload";
import { InAppNotificationContributorMentionedPayload } from "./in.app.notification.contributor.mentioned.payload";

export type InAppNotificationPayload =
  | InAppNotificationCalloutPublishedPayload
  | InAppNotificationCommunityNewMemberPayload
  | InAppNotificationContributorMentionedPayload;
