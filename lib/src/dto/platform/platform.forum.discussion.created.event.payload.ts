import { ContributorPayload } from '../contributor.payload';
import { PlatformBaseEventPayload } from './platform.base.event.payload';

export interface PlatformForumDiscussionCreatedEventPayload
  extends PlatformBaseEventPayload {
  discussion: {
    id: string;
    createdBy: ContributorPayload;
    displayName: string;
    url: string;
  };
}
