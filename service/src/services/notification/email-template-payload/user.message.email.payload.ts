import { BaseEmailPayload } from './base.email.payload';

export interface CommunicationUserMessageEmailPayload extends BaseEmailPayload {
  messageSender: {
    displayName: string;
    email: string;
    firstName: string;
  };
  messageReceiver: {
    displayName: string;
    firstName: string;
  };
  message: string;
}
