import { BaseEmailPayload } from './base.email.payload';

export interface OrganizationAssociateInvitationEmailPayload extends BaseEmailPayload {
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
  organizationUrl: string;
}
