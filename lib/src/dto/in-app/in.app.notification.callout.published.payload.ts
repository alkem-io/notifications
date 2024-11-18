import { InAppNotificationPayload } from "./in.app.notification.payload";

export interface InAppNotificationCalloutPublishedPayload extends InAppNotificationPayload {
  calloutID: string;
  spaceID: string;
}
