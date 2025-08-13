import { UserPayload } from "../user.payload";
import { PlatformBaseEventPayload } from "./platform.base.event.payload";

export interface PlatformUserRegistrationEventPayload
  extends PlatformBaseEventPayload {
    user: UserPayload;
};
