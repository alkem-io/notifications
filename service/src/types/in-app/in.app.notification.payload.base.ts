import {
  InAppNotificationCategory,
  InAppNotificationEventType,
} from '@src/generated/graphql';

export interface InAppNotificationPayloadBase {
  receiverIDs: string[];
  /** UTC */
  triggeredAt: Date;
  type: InAppNotificationEventType;
  triggeredByID: string;
  category: InAppNotificationCategory;
}
