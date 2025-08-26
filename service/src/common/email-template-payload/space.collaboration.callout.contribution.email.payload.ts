import { BaseJourneyEmailPayload } from './base.journey.email.payload';

export interface CollaborationPostCreatedEmailPayload
  extends BaseJourneyEmailPayload {
  createdBy: {
    firstName: string;
    email: string;
  };
  callout: {
    displayName: string;
    url: string;
  };
  contribution: {
    displayName: string;
    url: string;
    type: string;
  };
}
