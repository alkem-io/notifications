import { SpacePayload } from './space.payload';
import { SpaceBaseEventPayload } from './space.base.event.payload';

export interface CommunityApplicationCreatedEventPayload extends SpaceBaseEventPayload {
  applicant: {
    id: string;
    displayName: string;
    url: string;
  }
}
