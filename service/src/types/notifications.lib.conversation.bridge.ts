import { BaseEventPayload } from '@alkemio/notifications-lib';

/**
 * TEMPORARY INLINE BRIDGE — 034-messaging-notifications (contract C-3).
 *
 * These interfaces are declared here, verbatim copies of
 * `lib/src/dto/user/notification.event.payload.user.conversation.message.{direct,group}.ts`,
 * ONLY because `@alkemio/notifications-lib@0.19.0` (which exports them) has not
 * been published to the registry yet. The service pins the published `0.18.0`
 * so that a clean `npm ci` — and therefore the release image, whose Dockerfile
 * copies `service/package*.json` and never `lib/` — keeps building.
 *
 * PRE-MERGE STEP (human gate): once lib 0.19.0 is published, bump the pin to
 * 0.19.0, re-point the four import sites at `@alkemio/notifications-lib`, and
 * delete this file. Keep it byte-identical to the lib DTOs until then.
 *
 * Same precedent as the server slice's inline payload interfaces
 * (workspace#099-element-room-check).
 */

/**
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

/**
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
