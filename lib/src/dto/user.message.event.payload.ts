import { BaseEventPayload } from './base.event.payload';
import { ContributorPayload } from './type/contributor.payload';
export interface UserMessageEventPayload extends BaseEventPayload {
  message: string;
  messageReceiver: ContributorPayload;
}
