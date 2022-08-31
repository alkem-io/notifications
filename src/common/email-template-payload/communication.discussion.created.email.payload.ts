import { BaseEmailPayload } from './base.email.payload';
import { CommunityType } from '@common/dto';

export interface CommunicationDiscussionCreatedEmailPayload
  extends BaseEmailPayload {
  createdBy: {
    name: string;
    firstname: string;
    email: string;
    profile: string;
  };
  discussion: {
    id: string;
    title: string;
    description: string;
  };
  recipient: {
    firstname: string;
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
