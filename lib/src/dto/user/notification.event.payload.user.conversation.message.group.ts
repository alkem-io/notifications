import { BaseEventPayload } from '../base.event.payload';

/**
 * 034-messaging-notifications (contract C-2/C-3, data-model.md §3).
 *
 * Wire payload for a group conversation message notification. Sibling of
 * `NotificationEventPayloadUserConversationMessageDirect`; adds
 * `conversation.displayName` since group email/push copy names the
 * conversation. NO message-content field exists on this DTO (FR-008).
 */
export interface NotificationEventPayloadUserConversationMessageGroup
  extends BaseEventPayload {
  sender: { displayName: string };
  conversation: { id: string; url: string; displayName: string };
}
