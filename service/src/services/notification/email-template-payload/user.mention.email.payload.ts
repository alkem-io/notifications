import { BaseEmailPayload } from './base.email.payload';

export interface CommunicationUserMentionEmailPayload extends BaseEmailPayload {
  commentSender: {
    displayName: string;
    firstName: string;
  };
  comment: string;
  commentOrigin: {
    url: string;
    displayName: string;
  };
}
