import { BaseJourneyEmailPayload } from './base.journey.email.payload';
// @ts-
export interface CollaborationCardCommentEmailPayload
  extends BaseJourneyEmailPayload {
  card: {
    displayName: string;
  };
  createdBy: {
    firstname: string;
    email: string;
  };
}
