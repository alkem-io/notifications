import { BaseEventPayload } from './base.event.payload';

export interface CommentReplyEventPayload extends BaseEventPayload {
  reply: string;
  comment: {
    commentOwnerId: string;
    commentUrl: string;
    commentOrigin: string;
  };
}
