import { ContributorPayload } from '../contributor.payload';
import { NotificationEventPayloadSpace } from './notification.event.payload.space';

export interface NotificationEventPayloadSpaceCommunityInvitation
  extends NotificationEventPayloadSpace {
  invitee: ContributorPayload;
  welcomeMessage?: string;
}
