import { BaseEmailPayload } from './base.email.payload';

export interface CommunicationUserMentionEmailPayload extends BaseEmailPayload {
  commentSender: {
    displayName: string;
    firstName: string;
  };
  comment: string;
  mentionedUser: {
    displayName: string;
    firstName: string;
  };
  commentOrigin: {
    url: string;
    displayName: string;
  };
}
