import { NotificationEventPayloadSpace } from "../space/notification.event.payload.space";

// Event USER_EMAIL_CHANGE_SPACE_ADMIN_NOTIFICATION — published per qualifying
// space via the server's buildBaseEventPayload. Extends
// NotificationEventPayloadSpace, so it carries the full BaseEventPayload
// envelope (including a server-resolved `recipients` array) plus the single
// `space` the event concerns.
export interface NotificationEventPayloadUserEmailChangeSpaceAdmin
  extends NotificationEventPayloadSpace {
  subjectProfileSummary: { id: string; displayName: string };
  oldEmail: string;
  newEmail: string;
  initiatorProfileSummary?: { id: string; displayName: string };
  initiatorRole: "self" | "platform_admin";
  commitTimestampISO8601: string;
  triggerOutcome: "COMMITTED" | "DRIFT_DETECTED";
}
