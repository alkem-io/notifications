import { BaseEventPayload } from '../base.event.payload';

/**
 * 034-messaging-notifications (contract C-2/C-3, data-model.md §3).
 *
 * Wire payload for a direct (1:1) conversation message notification.
 * NO message-content field exists on this DTO (FR-008, by construction) —
 * only the sender's display name, the conversation's identity, and the
 * deep-link URL to it. `triggeredBy.email` is zeroed by the server builder
 * before this leaves the process (sender PII never rides the durable queue).
 */
export interface NotificationEventPayloadUserConversationMessageDirect extends BaseEventPayload {
  sender: { displayName: string };
  conversation: { id: string; url: string };
}
