import { InAppNotificationPayload } from "./in.app.notification.payload";

export interface InAppNotificationCommunityNewMemberPayload extends InAppNotificationPayload {
  newMemberID: string;
  spaceID: string;
}
