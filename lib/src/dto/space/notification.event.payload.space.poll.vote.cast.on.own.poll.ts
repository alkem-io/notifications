import { NotificationEventPayloadSpace } from './notification.event.payload.space';
import { PollPayload } from './poll.payload';

export interface NotificationEventPayloadSpacePollVoteCastOnOwnPoll
  extends NotificationEventPayloadSpace {
  poll: PollPayload;
}
