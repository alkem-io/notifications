import { ContributorPayload } from '../contributor.payload';
import { SpaceBaseEventPayload } from './space.base.event.payload';

export interface SpaceCommunityInvitationCreatedEventPayload
  extends SpaceBaseEventPayload {
  invitee: ContributorPayload;
  welcomeMessage?: string;
}
