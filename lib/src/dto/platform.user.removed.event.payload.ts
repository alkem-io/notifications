import { BaseEventPayload } from "./base.event.payload";

export interface PlatformUserRemovedEventPayload
  extends BaseEventPayload {
  userID: string;
};
