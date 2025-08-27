import { BaseSpaceEmailPayload } from './base.space.email.payload';

export interface CommunityNewMemberEmailPayload extends BaseSpaceEmailPayload {
  member: {
    name: string;
    profile: string;
    type: string;
  };
}
