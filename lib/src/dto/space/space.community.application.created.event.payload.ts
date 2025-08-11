import { ContributorPayload } from '../contributor.payload';
import { SpaceBaseEventPayload } from './space.base.event.payload';

export interface SpaceCommunityApplicationCreatedEventPayload extends SpaceBaseEventPayload {
  applicant: ContributorPayload;
}
