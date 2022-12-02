
import { JourneyBaseEventPayload } from './journey.base.event.payload';

export interface CommunityNewMemberPayload extends JourneyBaseEventPayload {
  userID: string;
}
