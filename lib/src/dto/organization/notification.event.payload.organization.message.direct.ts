import { NotificationEventPayloadOrganization } from "./notification.event.payload.organization";

export interface NotificationEventPayloadOrganizationMessageDirect
  extends NotificationEventPayloadOrganization {
  message: string;
}
