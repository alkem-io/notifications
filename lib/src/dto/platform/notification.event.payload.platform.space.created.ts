import { SpacePayload } from "../space";
import { NotificationEventPayloadPlatform } from "./notification.event.payload.platform";

export interface NotificationEventPayloadPlatformSpaceCreated extends NotificationEventPayloadPlatform {
  space: SpacePayload;
  created: number;
  sender: {
    name: string;
    url: string;
  }
}
