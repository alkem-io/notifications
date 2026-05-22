import { BaseEventPayload } from "../base.event.payload";

// Event USER_EMAIL_CHANGE_GLOBAL_ADMIN_NOTIFICATION — published via the
// server's buildBaseEventPayload, so it carries the full BaseEventPayload
// envelope including a server-resolved `recipients` array.
export interface NotificationEventPayloadUserEmailChangeGlobalAdmin
  extends BaseEventPayload {
  subjectProfileSummary: { id: string; displayName: string };
  oldEmail: string;
  newEmail: string;
  initiatorProfileSummary?: { id: string; displayName: string };
  initiatorRole: "self" | "platform_admin";
  // Who authorized the change within the subject's organization. Present for
  // platform-admin changes; absent for the self-service flow.
  approver?: { name: string; role: string; organization?: string };
  // Admin-supplied justification for the change. Present for platform-admin
  // changes; absent for the self-service flow.
  reason?: string;
  commitTimestampISO8601: string;
  triggerOutcome: "COMMITTED" | "DRIFT_DETECTED";
  subjectMemberships?: {
    spaces: { spaceId: string; level: string; roles: string[] }[];
    organizations: { organizationId: string; roles: string[] }[];
  };
  subjectGlobalRoles?: string[];
}
