import { NotificationEventPayloadUser } from './notification.event.payload.user';

export interface UserCommentReplyEventPayload extends NotificationEventPayloadUser {
  reply: string;
  comment: {
    commentOwnerId: string;
    commentUrl: string;
    commentOrigin: string;
  };
}
