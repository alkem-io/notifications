import { BaseJourneyEmailPayload } from './base.journey.email.payload';

export interface SpaceCreatedEmailPayload extends BaseJourneyEmailPayload {
  dateCreated: string;
  sender: {
    name: string;
    url: string;
  };
}
