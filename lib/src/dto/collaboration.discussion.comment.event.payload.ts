import { JourneyBaseEventPayload } from './journey.base.event.payload';

export interface CollaborationDiscussionCommentEventPayload extends JourneyBaseEventPayload {
  callout: {
    displayName: string;
    nameID: string;
  }
  comment: {
    message: string;
    createdBy: string;
  };
}
