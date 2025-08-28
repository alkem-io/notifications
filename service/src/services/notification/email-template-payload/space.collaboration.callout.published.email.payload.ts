import { BaseSpaceEmailPayload } from './base.space.email.payload';

export interface CollaborationCalloutPublishedEmailPayload
  extends BaseSpaceEmailPayload {
  callout: {
    displayName: string;
    url: string;
    type: string;
  };
  publishedBy: {
    firstName: string;
  };
}
