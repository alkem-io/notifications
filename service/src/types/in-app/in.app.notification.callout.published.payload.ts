import { InAppNotificationEventType } from '@src/generated/graphql';
import { InAppNotificationPayloadBase } from './in.app.notification.payload.base';

export interface InAppNotificationCalloutPublishedPayload
  extends InAppNotificationPayloadBase {
  type: InAppNotificationEventType.CollaborationCalloutPublished;
  calloutID: string;
  spaceID: string;
}
