import { BaseJourneyEmailPayload } from './base.journey.email.payload';

export interface CommunityInvitationCreatedEmailPayload
  extends BaseJourneyEmailPayload {
  invitee: {
    name: string;
    firstName: string;
    email: string;
    profile: string;
  };
  journeyAdminURL: string;
}
