import { SpaceCommunityInvitationCreatedEventPayload } from './space.community.invitation.created.event.payload';
import { ContributorPayload } from '../contributor.payload';

export interface SpaceCommunityInvitationVirtualContributorCreatedEventPayload extends SpaceCommunityInvitationCreatedEventPayload {
  host: ContributorPayload;
}
