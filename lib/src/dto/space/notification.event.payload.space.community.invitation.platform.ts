import { NotificationEventPayloadSpace } from "./notification.event.payload.space";

export interface NotificationEventPayloadSpaceCommunityInvitationPlatform
  extends NotificationEventPayloadSpace {
  welcomeMessage?: string;
}
