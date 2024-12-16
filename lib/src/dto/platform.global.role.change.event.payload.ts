import { RoleChangeType } from "../common/enums";
import { BaseEventPayload } from "./base.event.payload";
import { ContributorPayload } from "./contributor.payload";

export interface PlatformGlobalRoleChangeEventPayload
  extends BaseEventPayload {
  type: RoleChangeType;
  user: ContributorPayload
  role: string;
  actor: ContributorPayload;
}
