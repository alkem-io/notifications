import { SpaceBaseEventPayload } from './space.base.event.payload';

export interface CollaborationCalloutPublishedEventPayload extends SpaceBaseEventPayload {
  callout: {
    id: string;
    displayName: string;
    description: string;
    nameID: string;
    type: string;
    url: string;
  };
}
