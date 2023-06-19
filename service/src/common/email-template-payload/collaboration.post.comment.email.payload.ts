import { BaseJourneyEmailPayload } from './base.journey.email.payload';
// @ts-
export interface CollaborationPostCommentEmailPayload
  extends BaseJourneyEmailPayload {
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
