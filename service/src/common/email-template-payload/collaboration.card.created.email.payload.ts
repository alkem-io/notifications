import { BaseJourneyEmailPayload } from './base.journey.email.payload';

export interface CollaborationCardCreatedEmailPayload
  extends BaseJourneyEmailPayload {
  createdBy: {
    firstname: string;
    email: string;
  };
  card: {
    displayName: string;
  };
}
