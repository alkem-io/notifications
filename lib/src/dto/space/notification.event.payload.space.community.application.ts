import { ContributorPayload } from '../contributor.payload';
import { NotificationEventPayloadSpace } from './notification.event.payload.space';

export interface NotificationEventPayloadSpaceCommunityApplication extends NotificationEventPayloadSpace {
  applicant: ContributorPayload;
}
