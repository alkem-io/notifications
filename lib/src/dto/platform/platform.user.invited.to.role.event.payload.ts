import { ContributorPayload } from "../contributor.payload";
import { PlatformBaseEventPayload } from "./platform.base.event.payload";

export interface PlatformUserInvitedToRoleEventPayload
  extends PlatformBaseEventPayload {
    user: ContributorPayload;
    role: string;
    invitees: {
      email: string;
    }[];
    welcomeMessage?: string;
};
