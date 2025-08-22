import { BaseJourneyEmailPayload } from './base.journey.email.payload';

export interface CollaborationWhiteboardCreatedEmailPayload
  extends BaseJourneyEmailPayload {
  createdBy: {
    firstName: string;
    email: string;
  };
  callout: {
    displayName: string;
    url: string;
  };
  whiteboard: {
    displayName: string;
    url: string;
  };
}
