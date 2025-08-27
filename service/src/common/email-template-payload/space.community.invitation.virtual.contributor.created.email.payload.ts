import { CommunityInvitationCreatedEmailPayload } from './space.community.invitation.created.email.payload';

export interface CommunityInvitationVirtualContributorCreatedEmailPayload
  extends CommunityInvitationCreatedEmailPayload {
  virtualContributor: {
    name: string;
    url: string;
  };
}
