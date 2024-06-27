import { SpaceType } from '@alkemio/notifications-lib';
import { BaseJourneyEmailPayload } from './base.journey.email.payload';

export interface SpaceCreatedEmailPayload extends BaseJourneyEmailPayload {
  space: {
    displayName: string;
    url: string;
    dateCreated: string;
    timeCreated: string;
    type: SpaceType;
  };
  plan: string;
  host: string;
}
