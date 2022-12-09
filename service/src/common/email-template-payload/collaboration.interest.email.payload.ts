import { BaseJourneyEmailPayload } from './base.journey.email.payload';

export interface CollaborationInterestEmailPayload
  extends BaseJourneyEmailPayload {
  user: {
    name: string;
  };
  relation: {
    role: string;
    description: string;
  };
}
