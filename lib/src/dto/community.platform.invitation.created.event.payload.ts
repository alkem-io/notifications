import { SpaceBaseEventPayload } from './space.base.event.payload';
export interface CommunityPlatformInvitationCreatedEventPayload
  extends SpaceBaseEventPayload {
  invitees: {
    email: string;
  }[];
  welcomeMessage?: string;
}
