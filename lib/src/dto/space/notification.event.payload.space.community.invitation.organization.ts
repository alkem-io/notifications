import { NotificationEventPayloadSpaceCommunityInvitation } from './notification.event.payload.space.community.invitation';

export interface NotificationEventPayloadSpaceCommunityInvitationOrganization
  extends NotificationEventPayloadSpaceCommunityInvitation {
  organizationInvitationsUrl: string;
  extraRoles: string[];
  spacesToJoin: { displayName: string; url: string }[];
  recipientEmail?: string;
}
