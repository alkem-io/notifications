import { BaseEmailPayload } from '@common/email-template-payload';
import { CommunityType } from '@common/dto';

export interface ApplicationCreatedEmailPayload extends BaseEmailPayload {
  emailFrom: string;
  applicant: {
    name: string;
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
    type: CommunityType;
    url: string;
  };
  hub: {
    url: string;
  };
}
