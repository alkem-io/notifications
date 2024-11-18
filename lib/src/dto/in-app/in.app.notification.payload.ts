import { NotificationEventType } from "@src/notification.event.type";

export interface InAppNotificationPayload {
  receiverID: string;
  /** UTC */
  triggeredAt: Date;
  type: NotificationEventType;
  triggeredByID: string;
  category: string; // todo type
  // action: string; // todo type ???
}
