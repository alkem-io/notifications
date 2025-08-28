import { BaseSpaceEmailPayload } from './base.space.email.payload';

export interface CommunityApplicationCreatedEmailPayload
  extends BaseSpaceEmailPayload {
  applicant: {
    name: string;
    firstName: string;
    email: string;
    profile: string;
  };
  spaceAdminURL: string;
}
