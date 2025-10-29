import { BaseEventPayload } from "../base.event.payload";
import { SpacePayload } from "./space.payload";

export interface NotificationEventPayloadSpace
  extends BaseEventPayload {
  space: SpacePayload;
}
