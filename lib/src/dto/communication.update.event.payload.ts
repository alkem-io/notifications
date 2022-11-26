import { HubPayload } from './hub.payload';
import { BaseEventPayload } from './base.event.payload';
import { CommunityType } from '@common/enums/community.type';

export interface CommunicationUpdateEventPayload extends BaseEventPayload {
  update: {
    id: string;
    createdBy: string;
  };
  community: {
    name: string;
    type: CommunityType;
  };
  hub: HubPayload;
}
