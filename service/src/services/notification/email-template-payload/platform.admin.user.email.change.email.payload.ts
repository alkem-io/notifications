import { BaseEmailPayload } from './base.email.payload';

// Email-template payload for the USER_EMAIL_CHANGE_GLOBAL_ADMIN_NOTIFICATION
// message fanned out to platform administrators.
export interface PlatformAdminUserEmailChangeEmailPayload extends BaseEmailPayload {
  subjectName: string;
  initiatorName: string;
  isSelfInitiated: boolean;
  oldEmail: string;
  newEmail: string;
  changedAt: string;
  triggerOutcome: 'COMMITTED' | 'DRIFT_DETECTED';
  // Who authorized the change within the subject's organization. Absent for
  // self-service changes.
  approver?: { name: string; role: string; organization?: string };
  // Admin-supplied justification for the change. Absent for self-service changes.
  reason?: string;
}
