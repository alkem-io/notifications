import { BaseJourneyEmailPayload } from './base.journey.email.payload';

export interface CommunicationDiscussionCreatedEmailPayload
  extends BaseJourneyEmailPayload {
  createdBy: {
    firstName: string;
  };
  discussion: {
    title: string;
  };
}
