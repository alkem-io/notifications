import { BaseEventPayload } from './base.event.payload';
export interface CommunicationUserMentionEventPayload extends BaseEventPayload {
  comment: string;
  mentionedUser: {
    id: string;
    displayName: string;
  };
  commentOrigin: {
    url: string;
    displayName: string;
  };
}
