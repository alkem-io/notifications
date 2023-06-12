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
  post: {
    displayName: string;
    url: string;
  };
}
