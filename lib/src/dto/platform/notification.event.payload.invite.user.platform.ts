import { UserPayload } from "../user.payload";
import { NotificationEventPayloadPlatform } from "./notification.event.payload.platform";

export interface NotificationEventPayloadPlatformInviteUseToRole
  extends NotificationEventPayloadPlatform {
    user: UserPayload;
    role: string;
    invitees: {
      email: string;
    }[];
    welcomeMessage?: string;
};
