import { JourneyPayload } from './journey.payload';
import { JourneyBaseEventPayload } from './journey.base.event.payload';

export interface CommunityApplicationCreatedEventPayload extends JourneyBaseEventPayload {
  applicantID: string;
}
