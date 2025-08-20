import { BaseEventPayload } from "../base.event.payload";
import { ContributorPayload } from "../contributor.payload";

export interface NotificationEventPayloadOrganization
  extends BaseEventPayload {
  organization: ContributorPayload;
}
