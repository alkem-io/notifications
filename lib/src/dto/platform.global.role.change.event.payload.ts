import { RoleChangeType } from "@src/common/enums/role.change.type";
import { BaseEventPayload } from "./base.event.payload";
import { ContributorPayload } from "./type/contributor.payload";

export interface PlatformGlobalRoleChangeEventPayload
  extends BaseEventPayload {
  type: RoleChangeType;
  user: ContributorPayload
  role: string;
  actor: ContributorPayload;
}
