import { NotificationEventPayloadSpaceCommunityInvitation } from './notification.event.payload.space.community.invitation';
import { ContributorPayload } from '../contributor.payload';

export interface NotificationEventPayloadSpaceCommunityInvitationVirtualContributor extends NotificationEventPayloadSpaceCommunityInvitation {
  host: ContributorPayload;
}
