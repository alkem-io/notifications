import { BaseJourneyEmailPayload } from './base.journey.email.payload';

export interface CollaborationCalloutPublishedEmailPayload
  extends BaseJourneyEmailPayload {
  emailFrom: string;
  callout: {
    displayName: string;
    url: string;
  };
  publishedBy: {
    firstName: string;
  };
}
