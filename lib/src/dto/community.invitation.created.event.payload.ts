import { ContributorPayload } from './type/contributor.payload';
import { SpaceBaseEventPayload } from './space.base.event.payload';

export interface CommunityInvitationCreatedEventPayload
  extends SpaceBaseEventPayload {
  invitee: ContributorPayload;
  welcomeMessage?: string;
}
