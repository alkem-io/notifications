import { BaseEmailPayload } from '@common/email-template-payload';
import { JourneyType } from '../enums/journey.type';

export interface CommunityApplicationCreatedEmailPayload
  extends BaseEmailPayload {
  applicant: {
    name: string;
    firstname: string;
    email: string;
    profile: string;
  };
  recipient: {
    name: string;
    email: string;
    notificationPreferences: string;
  };
  community: {
    name: string;
    type: JourneyType;
    url: string;
  };
  hub: {
    url: string;
  };
}
