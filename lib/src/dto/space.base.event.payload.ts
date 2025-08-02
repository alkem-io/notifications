import { SpacePayload } from './type/space.payload';
import { BaseEventPayload } from './base.event.payload';

export interface SpaceBaseEventPayload
  extends BaseEventPayload {
  space: SpacePayload;
}
