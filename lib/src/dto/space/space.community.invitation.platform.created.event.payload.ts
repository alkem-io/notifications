import { SpaceBaseEventPayload } from "./space.base.event.payload";

export interface SpaceCommunityPlatformInvitationCreatedEventPayload
  extends SpaceBaseEventPayload {
  welcomeMessage?: string;
}
