import { BaseSpaceEmailPayload } from './base.space.email.payload';

export interface SpaceCollaborationCalloutCommentEmailPayload
  extends BaseSpaceEmailPayload {
  createdBy: {
    firstName: string;
    email: string;
  };
  callout: {
    displayName: string;
    url: string;
    type: string;
  };
}
