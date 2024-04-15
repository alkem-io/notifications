import { SpaceBaseEventPayload } from './space.base.event.payload';

export interface CollaborationWhiteboardCreatedEventPayload extends SpaceBaseEventPayload {
  callout: {
    displayName: string;
    nameID: string;
    url: string;
  }
  whiteboard: {
    id: string;
    createdBy: string;
    displayName: string;
    nameID: string;
    url: string;
  };
}
