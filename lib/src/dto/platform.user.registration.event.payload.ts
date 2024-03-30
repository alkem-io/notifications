import { BaseEventPayload } from "./base.event.payload";

export interface PlatformUserRegistrationEventPayload
  extends BaseEventPayload {
    user: {
      id: string;
      url: string;
      displayName: string;
    }
};
