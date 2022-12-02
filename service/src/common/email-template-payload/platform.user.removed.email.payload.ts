import { BaseEmailPayload } from './base.email.payload';

export interface PlatformUserRemovedEmailPayload extends BaseEmailPayload {
  registrant: {
    name: string;
    firstname: string;
    email: string;
    profile: string;
  };
}
