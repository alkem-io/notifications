import { BaseEmailPayload } from './base.email.payload';

/**
 * 034-messaging-notifications (contract C-2, FR-008/FR-009/D-15).
 *
 * Sibling of `UserConversationMessageDirectEmailPayload`; adds
 * `conversation.displayName` since the group email copy names the
 * conversation. NO message-content field; NO sender email field.
 */
export interface UserConversationMessageGroupEmailPayload extends BaseEmailPayload {
  sender: {
    displayName: string;
  };
  conversation: {
    url: string;
    displayName: string;
  };
}
