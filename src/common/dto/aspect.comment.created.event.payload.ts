import { BaseEventPayload } from './base.event.payload';

export interface AspectCommentCreatedEventPayload extends BaseEventPayload {
  aspect: {
    displayName: string;
    createdBy: string;
  };
  comment: {
    message: string;
    createdBy: string;
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
