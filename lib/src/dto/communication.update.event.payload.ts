import { JourneyBaseEventPayload } from './journey.base.event.payload';

export interface CommunicationUpdateEventPayload extends JourneyBaseEventPayload {
  update: {
    id: string;
    createdBy: string;
  };

}
