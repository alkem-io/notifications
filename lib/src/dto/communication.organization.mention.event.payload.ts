import { BaseEventPayload } from './base.event.payload';
export interface CommunicationOrganizationMentionEventPayload
  extends BaseEventPayload {
  comment: string;
  mentionedOrganization: {
    id: string;
    profile: {
      displayName: string;
      url: string;
    }
  };
  commentOrigin: {
    url: string;
    displayName: string;
  };
}
