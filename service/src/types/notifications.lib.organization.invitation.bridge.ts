import { NotificationEventPayloadSpaceCommunityInvitation } from '@alkemio/notifications-lib';

/**
 * Locally-declared payload shape for the organization space-invitation
 * event. Deliberately not part of `@alkemio/notifications-lib`: nothing
 * downstream needs this DTO to cross the package boundary, so keeping it
 * here avoids a lib version bump (and the publish-before-consume ordering
 * that would require) for an interface only this service uses. The server
 * worktree declares the same shape locally for the same reason — keep the
 * two in sync by hand if either side's fields change.
 */
export interface NotificationEventPayloadSpaceCommunityInvitationOrganization extends NotificationEventPayloadSpaceCommunityInvitation {
  organizationInvitationsUrl: string;
  extraRoles: string[];
  spacesToJoin: { displayName: string; url: string }[];
  recipientEmail?: string;
}
