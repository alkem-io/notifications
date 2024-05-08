import { SpaceBaseEventPayload } from './space.base.event.payload';

export interface CollaborationDiscussionCommentEventPayload extends SpaceBaseEventPayload {
  callout: {
    displayName: string;
    nameID: string;
    url: string;
  }
  comment: {
    message: string;
    createdBy: string;
  };
}
