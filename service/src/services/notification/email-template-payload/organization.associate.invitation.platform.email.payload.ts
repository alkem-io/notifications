import { BaseEmailPayload } from './base.email.payload';

export interface OrganizationAssociateInvitationPlatformEmailPayload extends BaseEmailPayload {
  inviter: {
    name: string;
    firstName: string;
    profile: string;
  };
  organization: {
    name: string;
    url: string;
  };
  offeredRole: string;
  welcomeMessage?: string;
  invitationsURL: string;
}
