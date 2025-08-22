import { BaseJourneyEmailPayload } from './base.journey.email.payload';

export interface SpaceCommunicationMessageDirectEmailPayload
  extends BaseJourneyEmailPayload {
  messageSender: {
    displayName: string;
    firstName: string;
    email: string;
  };
  message: string;
}
