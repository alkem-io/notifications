import { CommunityType } from './application.created.event.payload';
import { HubPayload } from './hub.payload';

export type CommunicationDiscussionCreatedEventPayload = {
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
};
