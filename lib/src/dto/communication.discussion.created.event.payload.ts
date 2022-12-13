import { JourneyBaseEventPayload } from './journey.base.event.payload';

export interface CommunicationDiscussionCreatedEventPayload
  extends JourneyBaseEventPayload {
  discussion: {
    id: string;
    createdBy: string;
    title: string;
    description: string;
  };
}
