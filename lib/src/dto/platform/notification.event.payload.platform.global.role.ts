import { RoleChangeType } from "@src/common/enums/role.change.type";
import { NotificationEventPayloadPlatform } from "./notification.event.payload.platform";
import { UserPayload } from "../user.payload";

export interface NotificationEventPayloadPlatformGlobalRole
  extends NotificationEventPayloadPlatform {
  type: RoleChangeType;
  user: UserPayload
  role: string;
}
