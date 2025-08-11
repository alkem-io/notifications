
import { ContributorPayload } from '../contributor.payload';
import { SpaceBaseEventPayload } from './space.base.event.payload';

export interface SpaceCommunityNewMemberPayload extends SpaceBaseEventPayload {
  contributor: ContributorPayload;
}
