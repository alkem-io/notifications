import { JourneyBaseEventPayload } from './journey.base.event.payload';

export interface CollaborationCanvasCreatedEventPayload extends JourneyBaseEventPayload {
  callout: {
    displayName: string;
    nameID: string;
  }
  canvas: {
    id: string;
    createdBy: string;
    displayName: string;
    nameID: string;
  };
}
