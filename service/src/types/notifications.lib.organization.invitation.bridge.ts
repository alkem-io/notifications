import { NotificationEventPayloadSpaceCommunityInvitation } from '@alkemio/notifications-lib';

/**
 * Temporary bridge until the pinned `@alkemio/notifications-lib` version
 * publishes this interface. Mirrors the lib DTO exactly — same field names,
 * same types — so swapping the import once the version is bumped is a pure
 * type-only change with no behavioural difference. Delete this file and
 * import `NotificationEventPayloadSpaceCommunityInvitationOrganization`
 * from `@alkemio/notifications-lib` instead once the pin moves to the
 * published version carrying it.
 */
export interface NotificationEventPayloadSpaceCommunityInvitationOrganization extends NotificationEventPayloadSpaceCommunityInvitation {
  organizationInvitationsUrl: string;
  extraRoles: string[];
  spacesToJoin: { displayName: string; url: string }[];
  recipientEmail?: string;
}
