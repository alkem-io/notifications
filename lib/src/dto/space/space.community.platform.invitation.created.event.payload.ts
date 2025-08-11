import { SpaceBaseEventPayload } from "./space.base.event.payload";

export interface SpaceCommunityPlatformInvitationCreatedEventPayload
  extends SpaceBaseEventPayload {
  invitees: {
    email: string;
  }[];
  welcomeMessage?: string;
}
