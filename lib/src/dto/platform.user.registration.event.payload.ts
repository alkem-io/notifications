import { BaseEventPayload } from "./base.event.payload";

export interface PlatformUserRegistrationEventPayload
  extends BaseEventPayload {
  userID: string;
};
