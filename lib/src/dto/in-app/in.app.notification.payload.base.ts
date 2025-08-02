import { InAppNotificationCategory } from "../../common/enums";
import { NotificationEventType } from "../../notification.event.type";

export interface InAppNotificationPayloadBase {
  receiverIDs: string[];
  /** UTC */
  triggeredAt: Date;
  type: NotificationEventType;
  triggeredByID: string;
  category: InAppNotificationCategory;
}
