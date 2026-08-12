import { BaseEventPayload } from '../base.event.payload';

/**
 * 034-messaging-notifications (contract C-2/C-3, data-model.md §3).
 *
 * One row of a messaging digest. Shared by both conversation-message digest
 * DTOs — declared here and imported by the GROUP sibling, never duplicated.
 */
export interface ConversationDigestEntry {
  /** Direct: the counterpart's display name. Group: the conversation's. */
  displayName: string;
  /** Unread messages for THIS recipient in that conversation, at dispatch time. */
  count: number;
  /** Deep link to that specific conversation (contract C-6). */
  url: string;
}

/**
 * 034-messaging-notifications (contract C-2/C-3, data-model.md §3).
 *
 * Wire payload for a DIRECT (1:1) conversation-message digest, revised for
 * Operator Ruling R4: the server debounces per recipient and emits one
 * aggregated event, never one event per message.
 *
 * Invariants (enforced on both sides of the wire):
 * - NO message-content field exists on this DTO (FR-008, by construction).
 * - `recipients` holds EXACTLY ONE entry — the digest is per recipient, so an
 *   event with 0 or >1 recipients is a contract violation.
 * - `senders` is NEVER empty; a track that finds nothing unread emits nothing
 *   at all (FR-018). An empty array reaching the service is a contract
 *   violation, not an "empty digest" to render.
 * - `totalCount === sum(senders[].count)` and `totalCount >= 1`.
 * - `triggeredBy.email` is zeroed by the server builder before this leaves the
 *   process (sender PII never rides the durable queue). On a digest
 *   `triggeredBy` is provenance only — templates MUST NOT render it; the
 *   digest names counterparts through `senders[]`.
 */
export interface NotificationEventPayloadUserConversationMessageDirect extends BaseEventPayload {
  /** One entry per 1:1 counterpart with unread messages. Never empty. */
  senders: ConversationDigestEntry[];
  /** Sum of `senders[].count` — precomputed for copy, never recomputed in a template. */
  totalCount: number;
}
