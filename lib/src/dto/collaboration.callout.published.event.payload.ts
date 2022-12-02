import { JourneyBaseEventPayload } from './journey.base.event.payload';

export interface CollaborationCalloutPublishedEventPayload extends JourneyBaseEventPayload {
  callout: {
    id: string;
    displayName: string;
    description: string;
    nameID: string;
    type: string;
  };
}
