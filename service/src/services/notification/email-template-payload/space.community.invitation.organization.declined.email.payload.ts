import { BaseSpaceEmailPayload } from './base.space.email.payload';

export interface OrganizationSpaceCommunityInvitationDeclinedEmailPayload extends BaseSpaceEmailPayload {
  actor: {
    name: string;
    firstName: string;
    profile: string;
  };
  organization: {
    name: string;
    url: string;
  };
  spaceCommunitySettingsURL: string;
}
