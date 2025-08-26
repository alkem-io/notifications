import { BaseJourneyEmailPayload } from './base.journey.email.payload';

export interface SpaceCollaborationCalloutCommentEmailPayload
  extends BaseJourneyEmailPayload {
  createdBy: {
    firstName: string;
    email: string;
  };
  callout: {
    displayName: string;
    url: string;
  };
}
