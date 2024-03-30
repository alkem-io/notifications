import { SpaceBaseEventPayload } from './space.base.event.payload';

export interface CommunicationCommunityLeadsMessageEventPayload
    extends SpaceBaseEventPayload {
    message: string;
}
