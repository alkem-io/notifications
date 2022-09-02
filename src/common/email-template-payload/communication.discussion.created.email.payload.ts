import { BaseEmailPayload } from './base.email.payload';

export interface CommunicationDiscussionCreatedEmailPayload
  extends BaseEmailPayload {
  createdBy: {
    firstname: string;
  };
  discussion: {
    title: string;
  };
  recipient: {
    firstname: string;
    email: string;
    notificationPreferences: string;
  };
  community: {
    name: string;
    url: string;
  };
  hub: {
    url: string;
  };
}
