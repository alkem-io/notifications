import { BaseEventPayload } from './base.event.payload';

export interface CommunityCollaborationInterestPayload
  extends BaseEventPayload {
  userID: string;
  opportunity: {
    id: string;
    name: string;
    communityName: string | undefined;
  };
  relation: {
    role: string;
    description: string;
  };
}
