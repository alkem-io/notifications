import { JourneyBaseEventPayload } from './journey.base.event.payload';
export interface CommunityExternalInvitationCreatedEventPayload
  extends JourneyBaseEventPayload {
  invitees: {
    email: string;
  }[];
  welcomeMessage?: string;
}
