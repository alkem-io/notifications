import { BaseSpaceEmailPayload } from './base.space.email.payload';

export interface CommunityInvitationCreatedEmailPayload
  extends BaseSpaceEmailPayload {
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
