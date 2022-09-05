import { CommunityType } from './application.created.event.payload';
import { BaseEventPayload } from './base.event.payload';
import { HubPayload } from './hub.payload';

export interface CommunityNewMemberPayload extends BaseEventPayload {
  userID: string;
  community: {
    name: string;
    url: string;
    type: CommunityType;
  };
  hub: HubPayload;
}
