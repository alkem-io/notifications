import { BaseEmailPayload } from './base.email.payload';

// Email-template payload for the USER_SECOND_FACTOR_CHANGE_SECURITY_SIGNAL
// message. Carries the observation timestamp (already formatted for display)
// and nothing that names a factor, code or device.
export interface UserSecondFactorChangeSecuritySignalEmailPayload extends BaseEmailPayload {
  changedAt: string;
}
