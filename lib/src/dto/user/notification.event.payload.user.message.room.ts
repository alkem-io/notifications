import { NotificationEventPayloadUser } from './notification.event.payload.user';

export interface NotificationEventPayloadUserMessageRoom extends NotificationEventPayloadUser {
  comment: string;
  commentOrigin: {
    url: string;
    displayName: string;
  };
}
