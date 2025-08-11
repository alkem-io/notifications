import { SpaceBaseEventPayload } from "./space.base.event.payload";

export interface SpaceCollaborationCalloutPublishedEventPayload extends SpaceBaseEventPayload {
  callout: {
    id: string;
    displayName: string;
    description: string;
    nameID: string;
    type: string;
    url: string;
  };
}
