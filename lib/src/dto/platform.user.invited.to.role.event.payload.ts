import { BaseEventPayload } from "./base.event.payload";
import { ContributorPayload } from "./contributor.payload";

export interface PlatformUserInvitedToRoleEventPayload
  extends BaseEventPayload {
    user: ContributorPayload;
    role: string;
    invitees: {
      email: string;
    }[];
    welcomeMessage?: string;
};
