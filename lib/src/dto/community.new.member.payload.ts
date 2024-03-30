
import { ContributorPayload } from './contributor.payload';
import { SpaceBaseEventPayload } from './space.base.event.payload';

export interface CommunityNewMemberPayload extends SpaceBaseEventPayload {
  user: ContributorPayload;
}
