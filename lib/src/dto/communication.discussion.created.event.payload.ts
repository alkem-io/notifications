import { HubPayload } from './hub.payload';
import { BaseEventPayload } from './base.event.payload';
import { CommunityType } from '@common/enums/community.type';

export interface CommunicationDiscussionCreatedEventPayload
  extends BaseEventPayload {
  discussion: {
    id: string;
    createdBy: string;
    title: string;
    description: string;
  };
  community: {
    name: string;
    type: CommunityType;
  };
  hub: HubPayload;
}
