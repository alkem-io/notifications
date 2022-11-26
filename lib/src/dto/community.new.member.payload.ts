import { CommunityType } from '@common/enums/community.type';
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
