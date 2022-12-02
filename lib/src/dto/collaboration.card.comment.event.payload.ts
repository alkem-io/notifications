import { JourneyBaseEventPayload } from './journey.base.event.payload';

export interface CollaborationCardCommentEventPayload extends JourneyBaseEventPayload {
  card: {
    displayName: string;
    createdBy: string;
  };
  comment: {
    message: string;
    createdBy: string;
  };
}
