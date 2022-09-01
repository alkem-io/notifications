import { BaseEmailPayload } from './base.email.payload';

export interface CommunityNewMemberEmailPayload extends BaseEmailPayload {
  member: {
    email: string;
  };
  recipient: {
    firstname: string;
    notificationPreferences: string;
  };
  community: {
    name: string;
  };
}
