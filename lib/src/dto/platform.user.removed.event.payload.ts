import { BaseEventPayload } from "./base.event.payload";

export interface PlatformUserRemovedEventPayload
  extends BaseEventPayload {
  user: {
    displayName: string;
    email: string;
  }
};
