import { HubPayload } from './hub.payload';
import { CommunityType } from './application.created.event.payload';

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
