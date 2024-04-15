import { SpaceBaseEventPayload } from './space.base.event.payload';
export interface CommunityExternalInvitationCreatedEventPayload
  extends SpaceBaseEventPayload {
  invitees: {
    email: string;
  }[];
  welcomeMessage?: string;
}
