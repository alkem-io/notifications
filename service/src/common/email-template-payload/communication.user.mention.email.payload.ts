import { BaseEmailPayload } from './base.email.payload';

export interface CommunicationUserMentionEmailPayload extends BaseEmailPayload {
  commentSender: {
    displayName: string;
  };
  comment: string;
  mentionedUser: {
    displayName: string;
  };
  commentOrigin: {
    url: string;
    displayName: string;
  };
}
