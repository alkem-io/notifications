import { JourneyType } from '../enums/journey.type';
import { BaseEmailPayload } from './base.email.payload';

export interface BaseJourneyEmailPayload extends BaseEmailPayload {
  journey: {
    name: string;
    url: string;
    type: JourneyType;
  };
}
