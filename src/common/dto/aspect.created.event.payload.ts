import { BaseEventPayload } from './base.event.payload';

export interface AspectCreatedEventPayload extends BaseEventPayload {
  aspect: {
    id: string;
    createdBy: string;
    displayName: string;
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
