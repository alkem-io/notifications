import { CommunityType } from '../enums/community.type';
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
  relation: {
    role: string;
    description: string;
  };
  community: {
    name: string;
    type: CommunityType;
    url: string;
  };
  hub: {
    url: string;
  };
}
