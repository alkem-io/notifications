import { BaseSpaceEmailPayload } from './base.space.email.payload';

export interface CommunityInvitationVirtualContributorDeclinedEmailPayload
  extends BaseSpaceEmailPayload {
  decliner: {
    name: string;
    firstName: string;
    email: string;
    profile: string;
  };
  virtualContributor: {
    name: string;
    url: string;
  };
  spaceURL: string;
}
