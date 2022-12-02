import { BaseJourneyEmailPayload } from './base.journey.email.payload';

export interface CommunityApplicationCreatedEmailPayload
  extends BaseJourneyEmailPayload {
  applicant: {
    name: string;
    firstname: string;
    email: string;
    profile: string;
  };
}
