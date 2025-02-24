import { RoleName } from "@alkemio/client-lib";
import { BaseEventPayload } from "./base.event.payload";
import { ContributorPayload } from "./contributor.payload";

export interface PlatformUserInvitedToRoleEventPayload
  extends BaseEventPayload {
    user: ContributorPayload;
    role: RoleName;
    invitees: {
      email: string;
    }[];
    welcomeMessage?: string;
};
