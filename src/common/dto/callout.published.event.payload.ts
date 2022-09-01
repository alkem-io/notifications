import { BaseEventPayload } from './base.event.payload';

export interface CalloutPublishedEventPayload extends BaseEventPayload {
  userID: string;
  callout: {
    id: string;
    displayName: string;
    description: string;
    type: string;
  };
  community: {
    name: string;
    type: string;
  };
  hub: {
    nameID: string;
    id: string;
    challenge?: {
      nameID: string;
      id: string;
      opportunity?: {
        nameID: string;
        id: string;
      };
    };
  };
}
