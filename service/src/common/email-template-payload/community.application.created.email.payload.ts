import { BaseJourneyEmailPayload } from './base.journey.email.payload';

export interface CommunityApplicationCreatedEmailPayload
  extends BaseJourneyEmailPayload {
  applicant: {
    name: string;
    firstName: string;
    email: string;
    profile: string;
  };
  journeyAdminURL: string;
}
