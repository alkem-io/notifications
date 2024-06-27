import { BaseJourneyEmailPayload } from './base.journey.email.payload';

export interface CommunityInvitationVirtualContributorCreatedEmailPayload
  extends BaseJourneyEmailPayload {
  inviter: {
    name: string;
    firstName: string;
    url: string;
  };
  virtualContributor: {
    name: string;
    url: string;
  };
}
