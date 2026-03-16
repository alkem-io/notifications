import { NotificationEventPayloadSpace } from './notification.event.payload.space';
import { PollPayload } from './poll.payload';

export interface NotificationEventPayloadSpacePollVoteCastOnPollIVotedOn
  extends NotificationEventPayloadSpace {
  poll: PollPayload;
}
