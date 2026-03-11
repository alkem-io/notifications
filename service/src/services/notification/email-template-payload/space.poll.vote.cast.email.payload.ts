import { BaseSpaceEmailPayload } from './base.space.email.payload';

export interface PollVoteCastEmailPayload extends BaseSpaceEmailPayload {
  poll: {
    calloutTitle: string;
    calloutUrl: string;
  };
  voter: {
    name: string;
  };
}
