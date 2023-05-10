import { BaseEmailPayload } from './base.email.payload';

export interface PlatformForumDiscussionCreatedEmailPayload
  extends BaseEmailPayload {
  createdBy: {
    firstName: string;
  };
  discussion: {
    displayName: string;
    url: string;
  };
}
