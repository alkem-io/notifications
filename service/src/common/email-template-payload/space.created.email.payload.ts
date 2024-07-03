import { BaseJourneyEmailPayload } from './base.journey.email.payload';

export interface SpaceCreatedEmailPayload extends BaseJourneyEmailPayload {
  space: {
    displayName: string;
    url: string;
    type: string;
  };
  dateCreated: string;
  sender: {
    name: string;
    url: string;
  };
}
