
import { ContributorPayload } from '../contributor.payload';
import { SpaceBaseEventPayload } from './space.base.event.payload';

export interface SpaceCollaborationPostCreatedEventPayload extends SpaceBaseEventPayload {
  callout: {
    displayName: string;
    nameID: string;
    url: string;
  }
  post:  {
    id: string;
    createdBy: ContributorPayload;
    displayName: string;
    nameID: string;
    url: string;
  };
}
