
import { JourneyBaseEventPayload } from './journey.base.event.payload';

export interface CollaborationInterestPayload
  extends JourneyBaseEventPayload {
  relation: {
    role: string;
    description: string;
  };
}
