import { JourneyType } from '../enums/journey.type';
import { BaseEmailPayload } from './base.email.payload';

export interface CollaborationInterestEmailPayload extends BaseEmailPayload {
  user: {
    name: string;
  };
  recipient: {
    firstname: string;
    email: string;
    notificationPreferences: string;
  };
  relation: {
    role: string;
    description: string;
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
