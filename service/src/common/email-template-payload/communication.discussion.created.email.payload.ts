import { BaseJourneyEmailPayload } from './base.journey.email.payload';

export interface CommunicationDiscussionCreatedEmailPayload
  extends BaseJourneyEmailPayload {
  createdBy: {
    firstname: string;
  };
  discussion: {
    title: string;
  };
}
