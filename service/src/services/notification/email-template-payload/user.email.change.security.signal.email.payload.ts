import { BaseEmailPayload } from './base.email.payload';

// Email-template payload for the USER_EMAIL_CHANGE_SECURITY_SIGNAL message.
// Carries only the masked new address — the full new address must never reach
// the old mailbox (FR-006).
export interface UserEmailChangeSecuritySignalEmailPayload extends BaseEmailPayload {
  changedAt: string;
  initiatorRole: 'self' | 'platform_admin';
  newEmailMasked: string;
}
