import { BaseEmailPayload } from './base.email.payload';

export interface CommunicationUpdateCreatedEmailPayload
  extends BaseEmailPayload {
  sender: {
    firstname: string;
    email: string;
    profile: string;
  };
  update: {
    id: string;
  };
  recipient: {
    firstname: string;
    email: string;
    notificationPreferences: string;
  };
  community: {
    name: string;
    type: string;
    url: string;
  };
  hub: {
    url: string;
  };
}
