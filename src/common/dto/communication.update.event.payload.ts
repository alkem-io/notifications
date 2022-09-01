import { HubPayload } from './hub.payload';
import { CommunityType } from './application.created.event.payload';
import { BaseEventPayload } from '@common/dto/base.event.payload';

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
