import { BaseEmailPayload } from './base.email.payload';

// Email-template payload for the USER_EMAIL_CHANGE_NEW_ADDRESS_NOTIFICATION
// message, delivered to the new mailbox the recipient owns.
export interface UserEmailChangeNewAddressEmailPayload extends BaseEmailPayload {
  changedAt: string;
  initiatorRole: 'self' | 'platform_admin';
  newEmailFull: string;
  loginUrl: string;
}
