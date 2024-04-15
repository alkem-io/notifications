import { BaseEventPayload } from './base.event.payload';
import { ContributorPayload } from './contributor.payload';
export interface CommunicationOrganizationMessageEventPayload
  extends BaseEventPayload {
  message: string;
  organization: ContributorPayload;
}
