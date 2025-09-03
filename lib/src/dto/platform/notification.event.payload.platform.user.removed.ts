import { NotificationEventPayloadPlatform } from "./notification.event.payload.platform";

export interface NotificationEventPayloadPlatformUserRemoved
  extends NotificationEventPayloadPlatform {
  user: {
    displayName: string;
    email: string;
  }
};
