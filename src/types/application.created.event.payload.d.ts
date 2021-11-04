export enum CommunityType {
  HUB = 'hub',
  CHALLENGE = 'challenge',
  OPPORTUNITY = 'opportunity',
}

export type ApplicationCreatedEventPayload = {
  applicationCreatorID: string;
  applicantID: string;
  community: {
    name: string;
    type: CommunityType;
  };
  hub: {
    id: string;
    challenge?: {
      id: string;
      opportunity?: {
        id: string;
      };
    };
  };
};
