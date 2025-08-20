
import { ContributorPayload } from '../contributor.payload';
import { NotificationEventPayloadSpace } from './notification.event.payload.space';

export interface NotificationEventPayloadSpaceCommunityContributor extends NotificationEventPayloadSpace {
  contributor: ContributorPayload;
}
