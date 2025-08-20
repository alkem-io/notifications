import { NotificationEventPayloadSpace } from "./notification.event.payload.space";

export interface NotificationEventPayloadSpaceCommunicationMessageDirect
    extends NotificationEventPayloadSpace {
    message: string;
}
