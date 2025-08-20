import { ContributorPayload } from '../contributor.payload';
import { NotificationEventPayloadPlatform } from './notification.event.payload.platform';

export interface NotificationEventPayloadPlatformForumDiscussion
  extends NotificationEventPayloadPlatform {
  discussion: {
    displayName: string;
    createdBy: ContributorPayload;
    url: string;
  };
  comment?: {
    message: string;
    createdBy: ContributorPayload;
    url: string;
  };
}
