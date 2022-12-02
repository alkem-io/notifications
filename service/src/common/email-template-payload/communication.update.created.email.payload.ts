import { BaseJourneyEmailPayload } from './base.journey.email.payload';

export interface CommunicationUpdateCreatedEmailPayload
  extends BaseJourneyEmailPayload {
  sender: {
    firstName: string;
  };
}
