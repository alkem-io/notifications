import { BaseEmailPayload } from './base.email.payload';

/**
 * 034-messaging-notifications (contract C-2, FR-008/FR-009/D-15).
 *
 * NO message-content field on this payload — sender display name and the
 * conversation deep link only. NO email field for the sender either
 * (`replyTo` is never set on this template; the sender's email address is
 * never disclosed to the recipient).
 */
export interface UserConversationMessageDirectEmailPayload extends BaseEmailPayload {
  sender: {
    displayName: string;
  };
  conversation: {
    url: string;
  };
}
