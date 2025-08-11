import { OrganizationBaseEventPayload } from './organization.base.event.payload';

export interface OrganizationMentionEventPayload
  extends OrganizationBaseEventPayload {
  comment: string;
  commentOrigin: {
    url: string;
    displayName: string;
  };
}
