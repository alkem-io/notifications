import { BaseEmailPayload } from './base.email.payload';

export interface PlatformForumDiscussionCommentEmailPayload
  extends BaseEmailPayload {
  comment: {
    message: string;
    createdBy: string;
  };
  discussion: {
    displayName: string;
    createdBy: string;
    url: string;
  };
}
