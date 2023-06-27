import { JourneyBaseEventPayload } from './journey.base.event.payload';

export interface CollaborationWhiteboardCreatedEventPayload extends JourneyBaseEventPayload {
  callout: {
    displayName: string;
    nameID: string;
  }
  whiteboard: {
    id: string;
    createdBy: string;
    displayName: string;
    nameID: string;
  };
}
