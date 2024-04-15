import { SpacePayload } from './space.payload';
import { SpaceBaseEventPayload } from './space.base.event.payload';
import { ContributorPayload } from './contributor.payload';

export interface CommunityApplicationCreatedEventPayload extends SpaceBaseEventPayload {
  applicant: ContributorPayload;
}
