import { BaseEmailPayload } from './base.email.payload';

export interface CollaborationCalloutPublishedEmailPayload
  extends BaseEmailPayload {
  emailFrom: string;
  recipient: {
    email: string;
    firstName: string;
    notificationPreferences: string;
  };
  community: {
    name: string;
    url: string;
  };
  callout: {
    displayName: string;
  };
  publishedBy: {
    firstName: string;
  };
  hub: {
    url: string;
  };
}
