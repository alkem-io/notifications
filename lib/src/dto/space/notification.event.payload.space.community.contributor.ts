
import { ContributorPayload } from '../contributor.payload';
import { NotificationEventPayloadSpace } from './notification.event.payload.space';

export interface SpaceCommunityNewMemberPayload extends NotificationEventPayloadSpace {
  contributor: ContributorPayload;
}
