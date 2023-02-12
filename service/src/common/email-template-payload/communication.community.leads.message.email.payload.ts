import { BaseJourneyEmailPayload } from './base.journey.email.payload';

export interface CommunicationCommunityLeadsMessageEmailPayload
  extends BaseJourneyEmailPayload {
  messageSender: {
    displayName: string;
    firstName: string;
    email: string;
  };
  message: string;
}
