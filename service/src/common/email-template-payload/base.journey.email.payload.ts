import { SpaceType } from '@alkemio/notifications-lib';
import { BaseEmailPayload } from './base.email.payload';

export interface BaseJourneyEmailPayload extends BaseEmailPayload {
  space: {
    displayName: string;
    url: string;
    type: SpaceType;
  };
}
