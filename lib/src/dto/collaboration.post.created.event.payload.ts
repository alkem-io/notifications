import { SpaceBaseEventPayload } from './space.base.event.payload';

export interface CollaborationPostCreatedEventPayload extends SpaceBaseEventPayload {
  callout: {
    displayName: string;
    nameID: string;
    url: string;
  }
  post:  {
    id: string;
    createdBy: string;
    displayName: string;
    nameID: string;
    type: string;
    url: string;
  };
}
