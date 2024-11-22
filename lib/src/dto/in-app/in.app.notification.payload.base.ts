import { NotificationEventType } from "../../notification.event.type";

export interface InAppNotificationPayloadBase {
  receiverID: string;
  /** UTC */
  triggeredAt: Date;
  type: NotificationEventType;
  triggeredByID: string;
  category: string; // todo type
}
