import { BaseJourneyEmailPayload } from './base.journey.email.payload';

export interface CommunityNewMemberEmailPayload
  extends BaseJourneyEmailPayload {
  member: {
    email: string;
    name: string;
    profile: string;
  };
}
