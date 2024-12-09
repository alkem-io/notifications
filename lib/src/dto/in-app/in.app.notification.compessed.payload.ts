import { InAppNotificationPayloadBase } from "./in.app.notification.payload.base";

/**
 * The compressed version of an In-App Notifications.
 * It is the same payload but with multiple receivers.
 */
export type CompressedInAppNotificationPayload<T extends InAppNotificationPayloadBase> = Exclude<T, 'receiverID'> & {
  receiverIDs: string[];
}
