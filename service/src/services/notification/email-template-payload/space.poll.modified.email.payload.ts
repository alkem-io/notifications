import { BaseSpaceEmailPayload } from './base.space.email.payload';

export interface PollModifiedEmailPayload extends BaseSpaceEmailPayload {
  poll: {
    title: string;
    url: string;
  };
}
