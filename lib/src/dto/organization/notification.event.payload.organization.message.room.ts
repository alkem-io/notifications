import { NotificationEventPayloadOrganization } from './notification.event.payload.organization';

export interface NotificationEventPayloadOrganizationMessageRoom
  extends NotificationEventPayloadOrganization {
  comment: string;
  commentOrigin: {
    url: string;
    displayName: string;
  };
}
