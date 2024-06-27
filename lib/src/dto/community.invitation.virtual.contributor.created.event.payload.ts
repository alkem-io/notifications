import { CommunityInvitationCreatedEventPayload } from './community.invitation.created.event.payload';
import { ContributorPayload } from './contributor.payload';

export interface CommunityInvitationVirtualContributorCreatedEventPayload extends CommunityInvitationCreatedEventPayload {
  host: ContributorPayload;
}
