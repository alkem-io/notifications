import { BaseEventPayload } from '../base.event.payload';
import { ConversationDigestEntry } from './notification.event.payload.user.conversation.message.direct';

/**
 * 034-messaging-notifications (contract C-2/C-3, data-model.md §3).
 *
 * Wire payload for a GROUP conversation-message digest, revised for Operator
 * Ruling R4. Sibling of
 * `NotificationEventPayloadUserConversationMessageDirect`; the entry array
 * names CONVERSATIONS instead of counterparts.
 *
 * Invariants (enforced on both sides of the wire):
 * - NO message-content field exists on this DTO (FR-008, by construction).
 * - NO sender-identity field exists on this DTO (FR-018a) — deliberately. The
 *   group digest names conversations, not people, so it can never imply "who
 *   said what". `triggeredBy` is provenance only and MUST NOT be rendered.
 * - `recipients` holds EXACTLY ONE entry — the digest is per recipient, so an
 *   event with 0 or >1 recipients is a contract violation.
 * - `conversations` is NEVER empty; a track that finds nothing unread emits
 *   nothing at all (FR-018). An empty array reaching the service is a contract
 *   violation, not an "empty digest" to render.
 * - `totalCount === sum(conversations[].count)` and `totalCount >= 1`.
 * - `triggeredBy.email` is zeroed by the server builder before this leaves the
 *   process (sender PII never rides the durable queue).
 */
export interface NotificationEventPayloadUserConversationMessageGroup extends BaseEventPayload {
  /** One entry per group conversation with unread messages. Never empty. */
  conversations: ConversationDigestEntry[];
  /** Sum of `conversations[].count` — precomputed for copy, never recomputed in a template. */
  totalCount: number;
}
