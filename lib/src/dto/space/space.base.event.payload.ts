import { BaseEventPayload } from "../base.event.payload";
import { SpacePayload } from "./space.payload";

export interface SpaceBaseEventPayload
  extends BaseEventPayload {
  space: SpacePayload;
}
