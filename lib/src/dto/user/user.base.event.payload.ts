import { BaseEventPayload } from "../base.event.payload";
import { ContributorPayload } from "../contributor.payload";

export interface UserBaseEventPayload
  extends BaseEventPayload {
  user: ContributorPayload;
}
