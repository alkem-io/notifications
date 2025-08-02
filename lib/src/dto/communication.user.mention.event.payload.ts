import { BaseEventPayload } from './base.event.payload';
import { ContributorPayload } from './type/contributor.payload';
export interface CommunicationUserMentionEventPayload extends BaseEventPayload {
  comment: string;
  mentionedUser: ContributorPayload;
  commentOrigin: {
    url: string;
    displayName: string;
  };
}
