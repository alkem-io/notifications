import { BaseEmailPayload } from './base.email.payload';

export interface PlatformUserRegisteredEmailPayload extends BaseEmailPayload {
  registrant: {
    displayName: string;
    firstName: string;
    email: string;
    profile: string;
  };
}
