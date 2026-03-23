import { NotificationEventPayloadSpace } from './notification.event.payload.space';
import { PollPayload } from './poll.payload';

export interface NotificationEventPayloadSpacePollModifiedOnPollIVotedOn
  extends NotificationEventPayloadSpace {
  poll: PollPayload;
}
