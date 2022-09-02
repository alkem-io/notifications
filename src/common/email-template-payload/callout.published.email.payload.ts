import { BaseEmailPayload } from '../email-template-payload/base.email.payload';

export interface CalloutPublishedEmailPayload extends BaseEmailPayload {
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
