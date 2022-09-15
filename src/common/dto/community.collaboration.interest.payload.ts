import { CommunityType } from '../enums/community.type';
import { BaseEventPayload } from './base.event.payload';
import { HubPayload } from './hub.payload';

export interface CommunityCollaborationInterestPayload
  extends BaseEventPayload {
  userID: string;

  relation: {
    role: string;
    description: string;
  };
  community: {
    name: string;
    type: CommunityType;
  };
  hub: HubPayload;
}
