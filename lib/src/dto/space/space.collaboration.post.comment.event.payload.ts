
import { ContributorPayload } from '../contributor.payload';
import { SpaceBaseEventPayload } from './space.base.event.payload';

export interface SpaceCollaborationPostCommentEventPayload extends SpaceBaseEventPayload {
  callout: {
    displayName: string;
    nameID: string;
    url: string;
  }
  post:  {
    displayName: string;
    createdBy: ContributorPayload;
    nameID: string;
    url: string;
  };
  comment: {
    message: string;
    createdBy: ContributorPayload;
  };
}
