import { SpaceBaseEventPayload } from './space.base.event.payload';

export interface CollaborationPostCommentEventPayload extends SpaceBaseEventPayload {
  callout: {
    displayName: string;
    nameID: string;
    url: string;
  }
  post:  {
    displayName: string;
    createdBy: string;
    nameID: string;
    url: string;
  };
  comment: {
    message: string;
    createdBy: string;
  };
}
