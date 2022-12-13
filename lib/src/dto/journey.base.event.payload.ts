import { JourneyPayload } from './journey.payload';
import { BaseEventPayload } from './base.event.payload';

export interface JourneyBaseEventPayload
  extends BaseEventPayload {

  journey: JourneyPayload;
}
