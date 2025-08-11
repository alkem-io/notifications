import { UserBaseEventPayload } from './user.base.event.payload';

export interface UserMentionEventPayload extends UserBaseEventPayload {
  comment: string;
  commentOrigin: {
    url: string;
    displayName: string;
  };
}
