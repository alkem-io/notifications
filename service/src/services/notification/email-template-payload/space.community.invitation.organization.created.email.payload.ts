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
  /**
   * True when this copy is the platform-support escalation sent because the
   * invited organization has no administrators to receive it. The
   * template says so, otherwise support has no way to tell why the mail
   * reached them.
   */
  isSupportEscalation: boolean;
}
