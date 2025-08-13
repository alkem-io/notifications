import { RoleChangeType } from "@src/common/enums/role.change.type";
import { PlatformBaseEventPayload } from "./platform.base.event.payload";
import { UserPayload } from "../user.payload";

export interface PlatformGlobalRoleChangeEventPayload
  extends PlatformBaseEventPayload {
  type: RoleChangeType;
  user: UserPayload
  role: string;
}
