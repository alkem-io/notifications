import { NotificationEventPayloadUser } from "./notification.event.payload.user";

export interface NotificationEventPayloadUserMessageDirect extends NotificationEventPayloadUser {
  message: string;
}
