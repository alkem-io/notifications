import { BaseEmailPayload } from './base.email.payload';

export interface BaseSpaceEmailPayload extends BaseEmailPayload {
  space: {
    displayName: string;
    url: string;
    level: string;
    type?: string; // to distinguish space + subspace
  };
}
