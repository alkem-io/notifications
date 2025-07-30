import { SpaceBaseEventPayload } from './space.base.event.payload';

export interface CommunicationUpdateEventPayload extends SpaceBaseEventPayload {
  update: {
    id: string;
    createdBy: string;
    url: string;
  };
  message?: string;
}
