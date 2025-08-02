import { BaseEventPayload } from './base.event.payload';
import { ContributorPayload } from './type/contributor.payload';
export interface OrganizationMentionEventPayload
  extends BaseEventPayload {
  comment: string;
  mentionedOrganization: ContributorPayload;
  commentOrigin: {
    url: string;
    displayName: string;
  };
}
