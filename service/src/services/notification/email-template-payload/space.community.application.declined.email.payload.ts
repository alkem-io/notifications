import { BaseSpaceEmailPayload } from './base.space.email.payload';

export interface CommunityApplicationDeclinedEmailPayload
  extends BaseSpaceEmailPayload {
  decliner: {
    name: string;
    firstName: string;
    email: string;
    profile: string;
  };
  spaceURL: string;
}
