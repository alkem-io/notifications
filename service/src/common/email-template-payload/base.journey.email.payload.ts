import { JourneyType } from '@alkemio/notifications-lib';
import { BaseEmailPayload } from './base.email.payload';

export interface BaseJourneyEmailPayload extends BaseEmailPayload {
  journey: {
    displayName: string;
    url: string;
    type: JourneyType;
  };
}
