import { BaseEmailPayload } from './base.email.payload';

export interface PlatformUserRemovedEmailPayload extends BaseEmailPayload {
  registrant: {
    displayName: string;
    email: string;
  };
}
