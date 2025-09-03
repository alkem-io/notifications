import { BaseSpaceEmailPayload } from './base.space.email.payload';

export interface CollaborationPostCreatedEmailPayload
  extends BaseSpaceEmailPayload {
  createdBy: {
    firstName: string;
    email: string;
  };
  callout: {
    displayName: string;
    url: string;
  };
  contribution: {
    displayName: string;
    url: string;
    type: string;
  };
}
