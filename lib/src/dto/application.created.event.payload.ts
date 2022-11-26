import { HubPayload } from './hub.payload';
import { BaseEventPayload } from './base.event.payload';
import { CommunityType } from '@common/enums/community.type';

export interface ApplicationCreatedEventPayload extends BaseEventPayload {
  applicationCreatorID: string;
  applicantID: string;
  community: {
    name: string;
    type: CommunityType;
  };
  hub: HubPayload;
}
