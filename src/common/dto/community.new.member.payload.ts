import { HubPayload } from './hub.payload';
import { CommunityType } from './application.created.event.payload';

export type CommunityNewMemberPayload = {
  userID: string;
  community: {
    name: string;
    type: CommunityType;
  };
  hub: HubPayload;
};
