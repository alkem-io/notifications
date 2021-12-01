export enum CommunityType {
  HUB = 'hub',
  CHALLENGE = 'challenge',
  OPPORTUNITY = 'opportunity',
}

// toDo: fix this type - derive from base event payload.
export type ApplicationCreatedEventPayload = {
  applicationCreatorID: string;
  applicantID: string;
  community: {
    name: string;
    type: CommunityType;
  };
  hub: {
    id: string;
    nameID: string;
    challenge?: {
      id: string;
      nameID: string;
      opportunity?: {
        nameID: string;
        id: string;
      };
    };
  };
};
