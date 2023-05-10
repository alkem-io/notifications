import { BaseEventPayload } from './base.event.payload';

export interface PlatformForumDiscussionCommentEventPayload
  extends BaseEventPayload {
  discussion: {
    displayName: string;
    createdBy: string;
    url: string;
  };
  comment: {
    message: string;
    createdBy: string;
  };
}
