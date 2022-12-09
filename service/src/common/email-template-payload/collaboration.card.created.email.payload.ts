import { BaseJourneyEmailPayload } from './base.journey.email.payload';

export interface CollaborationCardCreatedEmailPayload
  extends BaseJourneyEmailPayload {
  createdBy: {
    firstName: string;
    email: string;
  };
  callout: {
    displayName: string;
    url: string;
  };
  card: {
    displayName: string;
    url: string;
  };
}
