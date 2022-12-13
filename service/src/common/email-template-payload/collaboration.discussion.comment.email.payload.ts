import { BaseJourneyEmailPayload } from './base.journey.email.payload';
// @ts-
export interface CollaborationDiscussionCommentEmailPayload
  extends BaseJourneyEmailPayload {
  callout: {
    displayName: string;
    url: string;
  };
  createdBy: {
    firstName: string;
    email: string;
  };
  message: string;
}
