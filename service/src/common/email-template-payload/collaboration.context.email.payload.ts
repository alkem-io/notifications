import { BaseJourneyEmailPayload } from './base.journey.email.payload';

export interface CollaborationContextReviewEmailPayload
  extends BaseJourneyEmailPayload {
  reviewer: {
    name: string;
  };
  review: string;
}
