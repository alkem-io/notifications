import { BaseJourneyEmailPayload } from './base.journey.email.payload';

export interface CommunicationCommunityLeadsMessageEmailPayload
  extends BaseJourneyEmailPayload {
  messageSender: {
    displayName: string;
    email: string;
  };
  message: string;
}
