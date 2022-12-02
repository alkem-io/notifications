import { BaseJourneyEmailPayload } from './base.journey.email.payload';

export interface CommunicationUpdateCreatedEmailPayload
  extends BaseJourneyEmailPayload {
  sender: {
    firstname: string;
  };
}
