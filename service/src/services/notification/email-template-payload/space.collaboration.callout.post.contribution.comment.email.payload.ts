import { BaseSpaceEmailPayload } from './base.space.email.payload';
export interface CollaborationPostCommentEmailPayload
  extends BaseSpaceEmailPayload {
  callout: {
    displayName: string;
    url: string;
  };
  post: {
    displayName: string;
    url: string;
  };
  createdBy: {
    firstName: string;
    email: string;
  };
}
