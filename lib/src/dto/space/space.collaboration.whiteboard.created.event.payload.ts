import { ContributorPayload } from '../contributor.payload';
import { SpaceBaseEventPayload } from './space.base.event.payload';

export interface SpaceCollaborationWhiteboardCreatedEventPayload extends SpaceBaseEventPayload {
  callout: {
    displayName: string;
    nameID: string;
    url: string;
  }
  whiteboard: {
    id: string;
    createdBy: ContributorPayload;
    displayName: string;
    nameID: string;
    url: string;
  };
}
