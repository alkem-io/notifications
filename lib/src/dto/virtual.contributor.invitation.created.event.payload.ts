import { ContributorPayload } from './contributor.payload';
import { SpaceBaseEventPayload } from './space.base.event.payload';

export interface VirtualContributorInvitationCreatedEventPayload extends SpaceBaseEventPayload {
  host: ContributorPayload;
  virtualContributor: {
    name: string;
    url: string;
  }
}
