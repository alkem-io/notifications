import { BaseEmailPayload } from './base.email.payload';

export interface CommunityNewMemberEmailPayload extends BaseEmailPayload {
  member: {
    email: string;
    name: string;
  };
  recipient: {
    firstname: string;
    email: string;
    notificationPreferences: string;
  };
  community: {
    name: string;
  };
}
