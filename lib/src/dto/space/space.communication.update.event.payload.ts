import { ContributorPayload } from '../contributor.payload';
import { SpaceBaseEventPayload } from './space.base.event.payload';

export interface SpaceCommunicationUpdateEventPayload extends SpaceBaseEventPayload {
  update: {
    id: string;
    createdBy: ContributorPayload;
    url: string;
  };
  message?: string;
}
