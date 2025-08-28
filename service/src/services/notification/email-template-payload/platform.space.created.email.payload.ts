import { BaseSpaceEmailPayload } from './base.space.email.payload';

export interface SpaceCreatedEmailPayload extends BaseSpaceEmailPayload {
  dateCreated: string;
  sender: {
    name: string;
    url: string;
  };
}
