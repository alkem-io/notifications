import { BaseEmailPayload } from './base.email.payload';

// Email-template payload for the USER_PASSWORD_CHANGE_SECURITY_SIGNAL
// message. Carries the observation timestamp (already formatted for display)
// and nothing else credential-related — Kratos owns the password and never
// passes it through this service.
export interface UserPasswordChangeSecuritySignalEmailPayload extends BaseEmailPayload {
  changedAt: string;
}
