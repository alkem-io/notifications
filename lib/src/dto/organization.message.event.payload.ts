import { BaseEventPayload } from './base.event.payload';
import { ContributorPayload } from './type/contributor.payload';
export interface OrganizationMessageEventPayload
  extends BaseEventPayload {
  message: string;
  organization: ContributorPayload;
}
