import { InAppNotificationPayloadBase } from "./in.app.notification.payload.base";
import { NotificationEventType } from '../../notification.event.type';

export interface InAppNotificationCalloutPublishedPayload extends InAppNotificationPayloadBase {
  type: NotificationEventType.COLLABORATION_CALLOUT_PUBLISHED;
  calloutID: string;
  spaceID: string;
}
