import { ContributorPayload } from '../contributor.payload';
import { NotificationEventPayloadPlatform } from './notification.event.payload.platform';

export interface NotificationEventPayloadPlatformForumDiscussion
  extends NotificationEventPayloadPlatform {
  discussion: {
    id: string;
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
