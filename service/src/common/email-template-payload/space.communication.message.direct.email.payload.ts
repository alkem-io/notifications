import { BaseSpaceEmailPayload } from './base.space.email.payload';

export interface SpaceCommunicationMessageDirectEmailPayload
  extends BaseSpaceEmailPayload {
  messageSender: {
    displayName: string;
    firstName: string;
    email: string;
  };
  message: string;
}
