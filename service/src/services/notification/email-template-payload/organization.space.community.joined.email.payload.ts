import { BaseSpaceEmailPayload } from './base.space.email.payload';

/**
 * "Your organization has joined this Space" — sent to every OTHER ADMIN of the
 * organization (R17b: admins only, not owners) once one of them accepts the
 * Space invitation, so they know no action is needed. The accepting admin is
 * deliberately filtered out on all three channels by the server (R33): the
 * welcome exists to inform the others, and telling the acceptor that they
 * accepted informs nobody. An organization whose only admin accepts therefore
 * produces no recipients and no email.
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
