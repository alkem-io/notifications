import { BaseEmailPayload } from '@common/email-template-payload';
import { CommunityType } from '../enums/community.type';

export interface ApplicationCreatedEmailPayload extends BaseEmailPayload {
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
    type: CommunityType;
    url: string;
  };
  hub: {
    url: string;
  };
}
