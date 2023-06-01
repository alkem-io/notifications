import { JourneyBaseEventPayload } from './journey.base.event.payload';

export interface CommunityInvitationCreatedEventPayload
  extends JourneyBaseEventPayload {
  inviteeID: string;
}
