import { BaseEventPayload } from "./base.event.payload";
import { ContributorPayload } from "./type/contributor.payload";

export interface PlatformUserRegistrationEventPayload
  extends BaseEventPayload {
    user: ContributorPayload;
};
