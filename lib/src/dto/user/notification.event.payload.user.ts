import { BaseEventPayload } from "../base.event.payload";
import { UserPayload } from "../user.payload";

export interface NotificationEventPayloadUser
  extends BaseEventPayload {
  user: UserPayload;
}
