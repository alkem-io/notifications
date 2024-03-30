import { BaseEventPayload } from './base.event.payload';
import { ContributorPayload } from './contributor.payload';
export interface CommunicationUserMessageEventPayload extends BaseEventPayload {
  message: string;
  messageReceiver: ContributorPayload;
}
