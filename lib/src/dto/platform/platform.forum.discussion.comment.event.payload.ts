import { ContributorPayload } from '../contributor.payload';
import { PlatformBaseEventPayload } from './platform.base.event.payload';

export interface PlatformForumDiscussionCommentEventPayload
  extends PlatformBaseEventPayload {
  discussion: {
    displayName: string;
    createdBy: ContributorPayload;
    url: string;
  };
  comment: {
    message: string;
    createdBy: ContributorPayload;
    url: string;
  };
}
