import { BaseSpaceEmailPayload } from './base.space.email.payload';

export interface OrganizationSpaceCommunityInvitationCreatedEmailPayload extends BaseSpaceEmailPayload {
  inviter: {
    name: string;
    firstName: string;
    email: string;
    profile: string;
  };
  organization: {
    name: string;
    url: string;
  };
  offeredRole: string;
  spacesToJoin: { displayName: string; url: string }[];
  welcomeMessage?: string;
  organizationInvitationsUrl: string;
}
