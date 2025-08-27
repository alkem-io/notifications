import { BaseSpaceEmailPayload } from './base.space.email.payload';

export interface CommunicationUpdateCreatedEmailPayload
  extends BaseSpaceEmailPayload {
  sender: {
    firstName: string;
  };
  message: string;
}
