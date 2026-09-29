import { BaseSpaceEmailPayload } from './base.space.email.payload';

/**
 * "The organization responded to the invitation you sent" — accepted or
 * declined. Sent to EVERY admin of the Space, not to the inviter alone: the
 * server resolves recipients from the Space admin credential, which keeps
 * the event deliverable when the inviter has been deleted or demoted, and
 * is the only notification co-admins get about the membership change (the
 * generic "a new member joined" is suppressed for it). Accept and decline
 * carry identical data; only the template differs, and that is selected
 * from the event type, so one payload serves both.
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
