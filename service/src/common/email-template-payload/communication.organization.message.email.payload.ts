import { BaseEmailPayload } from './base.email.payload';

export interface CommunicationOrganizationMessageEmailPayload
  extends BaseEmailPayload {
  messageSender: {
    displayName: string;
    email: string;
    firstName: string;
  };
  message: string;
  organization: {
    displayName: string;
  };
}
