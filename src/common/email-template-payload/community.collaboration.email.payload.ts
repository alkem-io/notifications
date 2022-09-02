import { BaseEmailPayload } from './base.email.payload';

export interface CommunityCollaborationInterestEmailPayload
  extends BaseEmailPayload {
  user: {
    name: string;
  };
  recipient: {
    firstname: string;
    email: string;
    notificationPreferences: string;
  };
  opportunity: {
    name: string;
  };
  relation: {
    role: string;
    description: string;
  };
}
