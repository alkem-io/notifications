import { HubPayload } from './hub.payload';

export type CommunicationUpdateEventPayload = {
  update: {
    id: string;
    createdBy: string;
  };
  community: {
    name: string;
    type: CommunityType;
  };
  hub: HubPayload;
};
