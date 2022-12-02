import { BaseEmailPayload } from './base.email.payload';

export interface CollaborationContextReviewEmailPayload
  extends BaseEmailPayload {
  reviewer: {
    name: string;
  };
  recipient: {
    firstname: string;
    email: string;
    notificationPreferences: string;
  };
  community: {
    name: string;
  };
  review: string;
}
