import { UserBaseEventPayload } from './user.base.event.payload';

export interface UserCommentReplyEventPayload extends UserBaseEventPayload {
  reply: string;
  comment: {
    commentOwnerId: string;
    commentUrl: string;
    commentOrigin: string;
  };
}
