import { BaseEmailPayload } from './base.email.payload';

export interface PlatformUserRemovedEmailPayload extends BaseEmailPayload {
  registrant: {
    name: string;
    firstName: string;
    email: string;
    profile: string;
  };
}
