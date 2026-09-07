import { BaseSpaceEmailPayload } from './base.space.email.payload';

/**
 * "Your organization has joined this Space" — sent to every admin/owner of
 * the organization once one of them accepts the Space invitation, so the
 * others know no action is needed.
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
