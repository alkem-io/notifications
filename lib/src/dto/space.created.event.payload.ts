import { SpaceBaseEventPayload } from "./space.base.event.payload";

export interface SpaceCreatedEventPayload extends SpaceBaseEventPayload {
  host: string;
  plan: string;
}
