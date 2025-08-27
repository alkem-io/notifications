import { BaseSpaceEmailPayload } from './base.space.email.payload';

export interface SpaceCommunityInvitationPlatformCreatedEmailPayload
  extends BaseSpaceEmailPayload {
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
