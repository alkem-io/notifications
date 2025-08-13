import { UserPayload } from "../user.payload";
import { PlatformBaseEventPayload } from "./platform.base.event.payload";

export interface PlatformUserInvitedToRoleEventPayload
  extends PlatformBaseEventPayload {
    user: UserPayload;
    role: string;
    invitees: {
      email: string;
    }[];
    welcomeMessage?: string;
};
