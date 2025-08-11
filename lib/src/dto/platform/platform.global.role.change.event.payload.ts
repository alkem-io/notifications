import { RoleChangeType } from "@src/common/enums/role.change.type";
import { ContributorPayload } from "../contributor.payload";
import { PlatformBaseEventPayload } from "./platform.base.event.payload";

export interface PlatformGlobalRoleChangeEventPayload
  extends PlatformBaseEventPayload {
  type: RoleChangeType;
  user: ContributorPayload
  role: string;
  actor: ContributorPayload;
}
