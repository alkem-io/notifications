import { BaseSpaceEmailPayload } from './base.space.email.payload';

export interface PollVoteCastEmailPayload extends BaseSpaceEmailPayload {
  poll: {
    title: string;
    url: string;
  };
  voter: {
    name: string;
  };
}
