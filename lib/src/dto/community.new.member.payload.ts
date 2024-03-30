
import { SpaceBaseEventPayload } from './space.base.event.payload';

export interface CommunityNewMemberPayload extends SpaceBaseEventPayload {
  user: {
    id: string;
    url: string;
    displayName: string;
  }
}
