import { BaseSpaceEmailPayload } from './base.space.email.payload';

export interface PollModifiedEmailPayload extends BaseSpaceEmailPayload {
  poll: {
    calloutTitle: string;
    calloutUrl: string;
  };
}
