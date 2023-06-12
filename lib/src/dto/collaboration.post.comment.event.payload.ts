import { JourneyBaseEventPayload } from './journey.base.event.payload';

export interface CollaborationPostCommentEventPayload extends JourneyBaseEventPayload {
  callout: {
    displayName: string;
    nameID: string;
  }
  post:  {
    displayName: string;
    createdBy: string;
    nameID: string;
  };
  comment: {
    message: string;
    createdBy: string;
  };
}
