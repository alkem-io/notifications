import { JourneyType } from '@alkemio/notifications-lib';
import { BaseEmailPayload } from './base.email.payload';

export interface BaseJourneyEmailPayload extends BaseEmailPayload {
  journey: {
    name: string;
    url: string;
    type: JourneyType;
  };
}
