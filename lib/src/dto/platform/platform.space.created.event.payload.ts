import { SpacePayload } from "../space";
import { PlatformBaseEventPayload } from "./platform.base.event.payload";

export interface PlatformSpaceCreatedEventPayload extends PlatformBaseEventPayload {
  space: SpacePayload;
  created: number;
  sender: {
    name: string;
    url: string;
  }
}
