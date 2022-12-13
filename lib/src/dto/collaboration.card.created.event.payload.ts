import { JourneyBaseEventPayload } from './journey.base.event.payload';

export interface CollaborationCardCreatedEventPayload extends JourneyBaseEventPayload {
  callout: {
    displayName: string;
    nameID: string;
  }
  card: {
    id: string;
    createdBy: string;
    displayName: string;
    nameID: string;
    type: string;
  };
}
