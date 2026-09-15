import { BaseEmailPayload } from './base.email.payload';

/**
 * Shared payload shape for the six "actor" organization-associate events
 * (both invitation-response events, all three application events, and the
 * joined event) — only the template picked in `notification.service.ts`
 * differs between them. `actor` is the invitee (responses), the applicant
 * (application events) or the new associate (joined) — the wire payload's
 * `actor` field is a `ContributorPayload` (062 bridge), which has no
 * `firstName`; every template that names the actor uses `actor.name`.
 */
export interface OrganizationAssociateActorEmailPayload extends BaseEmailPayload {
  actor: {
    name: string;
    profile: string;
  };
  organization: {
    name: string;
    url: string;
  };
  offeredRole: string;
  rolesWithheld: string[];
  applicationMessage?: string;
  organizationAssociatesUrl: string;
  organizationUrl: string;
  /**
   * True only for the application-received copy sent to platform support
   * because the organization has no administrators to receive it.
   */
  isSupportEscalation: boolean;
}
