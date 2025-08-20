import { NotificationEventPayloadUser } from './notification.event.payload.user';

export interface UserMentionEventPayload extends NotificationEventPayloadUser {
  comment: string;
  commentOrigin: {
    url: string;
    displayName: string;
  };
}
