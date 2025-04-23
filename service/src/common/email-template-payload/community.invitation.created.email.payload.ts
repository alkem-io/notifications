import { BaseJourneyEmailPayload } from './base.journey.email.payload';

export interface CommunityInvitationCreatedEmailPayload
  extends BaseJourneyEmailPayload {
  inviter: {
    name: string;
    firstName: string;
    email: string;
    profile: string;
  };
  welcomeMessage?: string;
  spaceAdminURL: string;
  invitationsURL?: string;
}
