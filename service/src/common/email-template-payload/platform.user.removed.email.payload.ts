import { BaseEmailPayload } from './base.email.payload';

export interface PlatformUserRemovedEmailPayload extends BaseEmailPayload {
  registrant: {
    name: string;
    firstname: string;
    email: string;
    profile: string;
  };
  recipient: {
    firstname: string;
    email: string;
    notificationPreferences: string;
  };
  hub: {
    url: string;
  };
}
