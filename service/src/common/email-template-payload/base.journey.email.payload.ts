import { BaseEmailPayload } from './base.email.payload';

export interface BaseJourneyEmailPayload extends BaseEmailPayload {
  space: {
    displayName: string;
    url: string;
    level: string;
    type?: string; // to distinguish space + subspace
  };
}
