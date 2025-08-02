import { SpaceBaseEventPayload } from "./space.base.event.payload";

export interface PlatformSpaceCreatedEventPayload extends SpaceBaseEventPayload {
  created: number;
  sender: {
    name: string;
    url: string;
  }
}
