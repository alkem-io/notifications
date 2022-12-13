import { BaseJourneyEmailPayload } from './base.journey.email.payload';
// @ts-
export interface CollaborationCardCommentEmailPayload
  extends BaseJourneyEmailPayload {
  callout: {
    displayName: string;
    url: string;
  };
  card: {
    displayName: string;
    url: string;
  };
  createdBy: {
    firstName: string;
    email: string;
  };
}
