import { PlatformBaseEventPayload } from "./platform.base.event.payload";

export interface PlatformUserRemovedEventPayload
  extends PlatformBaseEventPayload {
  user: {
    displayName: string;
    email: string;
  }
};
