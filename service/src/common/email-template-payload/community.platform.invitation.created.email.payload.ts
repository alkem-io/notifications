import { BaseJourneyEmailPayload } from './base.journey.email.payload';

export interface CommunityPlatformInvitationCreatedEmailPayload
  extends BaseJourneyEmailPayload {
  inviter: {
    name: string;
    firstName: string;
    email: string;
    profile: string;
  };
  welcomeMessage?: string;
  emails?: string;
  spaceAdminURL: string;
  invitationsURL?: string;
}
