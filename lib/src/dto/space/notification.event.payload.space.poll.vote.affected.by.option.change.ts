import { NotificationEventPayloadSpace } from './notification.event.payload.space';
import { PollPayload } from './poll.payload';

export interface NotificationEventPayloadSpacePollVoteAffectedByOptionChange
  extends NotificationEventPayloadSpace {
  poll: PollPayload;
}
