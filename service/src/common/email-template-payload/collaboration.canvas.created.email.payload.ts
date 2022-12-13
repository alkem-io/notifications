import { BaseJourneyEmailPayload } from './base.journey.email.payload';

export interface CollaborationCanvasCreatedEmailPayload
  extends BaseJourneyEmailPayload {
  createdBy: {
    firstName: string;
    email: string;
  };
  callout: {
    displayName: string;
    url: string;
  };
  canvas: {
    displayName: string;
    url: string;
  };
}
