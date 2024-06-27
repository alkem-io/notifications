import { BaseJourneyEmailPayload } from './base.journey.email.payload';

export interface CommunityNewMemberEmailPayload
  extends BaseJourneyEmailPayload {
  member: {
    name: string;
    profile: string;
    type: string;
  };
}
