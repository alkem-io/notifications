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
}
