import { UserPayload } from "../user.payload";
import { NotificationEventPayloadPlatform } from "./notification.event.payload.platform";

export interface NotificationEventPayloadPlatformUserRegistration
  extends NotificationEventPayloadPlatform {
    user: UserPayload;
};
