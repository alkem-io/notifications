import { BaseEmailPayload } from './base.email.payload';

export interface CommentReplyEmailPayload extends BaseEmailPayload {
  reply: {
    message: string;
    createdBy: string;
    createdByUrl: string;
  };
  comment: {
    commentUrl: string;
    commentOrigin: string;
  };
}
