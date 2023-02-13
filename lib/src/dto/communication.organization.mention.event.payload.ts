import { BaseEventPayload } from './base.event.payload';
export interface CommunicationOrganizationMentionEventPayload
  extends BaseEventPayload {
  comment: string;
  mentionedOrganization: {
    id: string;
    displayName: string;
  };
  commentOrigin: {
    url: string;
    displayName: string;
  };
}
