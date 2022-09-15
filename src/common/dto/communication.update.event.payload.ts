import { HubPayload } from './hub.payload';
import { BaseEventPayload } from '@common/dto/base.event.payload';
import { CommunityType } from '../enums/community.type';

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
