import { HubPayload } from './hub.payload';

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
  hub: HubPayload;
};
