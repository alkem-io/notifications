import { ContributorPayload } from '../contributor.payload';
import { NotificationEventPayloadSpace } from './notification.event.payload.space';

export interface SpaceCommunityApplicationCreatedEventPayload extends NotificationEventPayloadSpace {
  applicant: ContributorPayload;
}
