import { BaseEmailPayload } from './base.email.payload';

export interface AspectCreatedEmailPayload extends BaseEmailPayload {
  createdBy: {
    firstname: string;
    email: string;
  };
  aspect: {
    displayName: string;
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
}
