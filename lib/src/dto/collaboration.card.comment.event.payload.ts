import { JourneyBaseEventPayload } from './journey.base.event.payload';

export interface CollaborationCardCommentEventPayload extends JourneyBaseEventPayload {
  callout: {
    displayName: string;
    nameID: string;
  }
  card: {
    displayName: string;
    createdBy: string;
    nameID: string;
  };
  comment: {
    message: string;
    createdBy: string;
  };
}
