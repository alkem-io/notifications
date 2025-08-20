import { NotificationEventPayloadSpace } from "./notification.event.payload.space";

export interface SpaceCommunityPlatformInvitationCreatedEventPayload
  extends NotificationEventPayloadSpace {
  welcomeMessage?: string;
}
