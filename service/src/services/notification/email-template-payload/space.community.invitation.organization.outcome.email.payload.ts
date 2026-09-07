import { BaseSpaceEmailPayload } from './base.space.email.payload';

/**
 * "The organization responded to the invitation you sent" — accepted or
 * declined. Sent to the Space admin who created the invitation. Accept and
 * decline carry identical data; only the template differs, and that is
 * selected from the event type, so one payload serves both.
 */
export interface OrganizationSpaceCommunityInvitationOutcomeEmailPayload extends BaseSpaceEmailPayload {
  /** The organization admin who answered on the organization's behalf. */
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
