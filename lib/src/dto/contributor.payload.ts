import { CommunityContributorType } from '@alkemio/client-lib';

export type ContributorPayload = {
  id: string;
  nameID: string;
  profile: {
    displayName: string;
    url: string;
  }
  type: CommunityContributorType
};
