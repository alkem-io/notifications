import { BaseEventPayload } from "../base.event.payload";
import { ContributorPayload } from "../contributor.payload";

export interface OrganizationBaseEventPayload
  extends BaseEventPayload {
  organization: ContributorPayload;
}
