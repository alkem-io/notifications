import { BaseEventPayload } from './base.event.payload';
import { ContributorPayload } from './contributor.payload';
export interface CommunicationOrganizationMentionEventPayload
  extends BaseEventPayload {
  comment: string;
  mentionedOrganization: ContributorPayload;
  commentOrigin: {
    url: string;
    displayName: string;
  };
}
