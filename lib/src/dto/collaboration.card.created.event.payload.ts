import { JourneyBaseEventPayload } from './journey.base.event.payload';

export interface CollaborationCardCreatedEventPayload extends JourneyBaseEventPayload {
  card: {
    id: string;
    createdBy: string;
    displayName: string;
    type: string;
  };
}
