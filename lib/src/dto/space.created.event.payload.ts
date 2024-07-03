import { SpaceBaseEventPayload } from "./space.base.event.payload";

export interface SpaceCreatedEventPayload extends SpaceBaseEventPayload {
  created: number;
  sender: {
    name: string;
    url: string;
  }
}
