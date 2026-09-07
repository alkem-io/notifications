import { BaseSpaceEmailPayload } from './base.space.email.payload';

/**
 * "Your organization has joined this Space" — sent to every ADMIN of the
 * organization (R17b: admins only, not owners) once one of them accepts the
 * Space invitation, so the others know no action is needed. The accepting
 * admin is deliberately NOT filtered out; they are one of the recipients.
 */
export interface OrganizationSpaceCommunityJoinedEmailPayload extends BaseSpaceEmailPayload {
  actor: {
    name: string;
    firstName: string;
    profile: string;
  };
  organization: {
    name: string;
    url: string;
  };
}
