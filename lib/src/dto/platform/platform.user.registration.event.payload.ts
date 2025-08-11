import { ContributorPayload } from "../contributor.payload";
import { PlatformBaseEventPayload } from "./platform.base.event.payload";

export interface PlatformUserRegistrationEventPayload
  extends PlatformBaseEventPayload {
    user: ContributorPayload;
};
