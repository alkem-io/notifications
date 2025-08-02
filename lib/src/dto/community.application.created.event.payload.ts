import { SpacePayload } from './type/space.payload';
import { SpaceBaseEventPayload } from './space.base.event.payload';
import { ContributorPayload } from './type/contributor.payload';

export interface CommunityApplicationCreatedEventPayload extends SpaceBaseEventPayload {
  applicant: ContributorPayload;
}
