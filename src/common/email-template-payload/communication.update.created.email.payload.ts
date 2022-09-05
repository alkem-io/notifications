import { BaseEmailPayload } from './base.email.payload';

export interface CommunicationUpdateCreatedEmailPayload
  extends BaseEmailPayload {
  sender: {
    firstname: string;
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
