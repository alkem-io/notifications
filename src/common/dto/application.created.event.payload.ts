import { HubPayload } from './hub.payload';
import { BaseEventPayload } from '@common/dto/base.event.payload';

export enum CommunityType {
  HUB = 'hub',
  CHALLENGE = 'challenge',
  OPPORTUNITY = 'opportunity',
}

export interface ApplicationCreatedEventPayload extends BaseEventPayload {
  applicationCreatorID: string;
  applicantID: string;
  community: {
    name: string;
    type: CommunityType;
  };
  hub: HubPayload;
}
