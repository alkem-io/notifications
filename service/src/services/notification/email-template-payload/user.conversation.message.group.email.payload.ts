import { BaseEmailPayload } from './base.email.payload';

/**
 * 034-messaging-notifications (contract C-2, FR-008/FR-009/FR-018a/D-15),
 * revised for Operator Ruling R4 — this is a DIGEST payload.
 *
 * Sibling of `UserConversationMessageDirectEmailPayload`; the rows name
 * CONVERSATIONS rather than counterparts. There is deliberately NO sender
 * field of any kind — the group digest never implies who said what.
 * NO message-content field; NO sender email field.
 */
export interface UserConversationMessageGroupEmailPayload extends BaseEmailPayload {
  /** One row per group conversation with unread messages. Never empty. */
  conversations: { displayName: string; count: number; url: string }[];
  /** Sum of `conversations[].count`. */
  totalCount: number;
  /**
   * Precomputed for the template: `conversations.length`. Templates must not
   * compute it — the plain-text (subject/title) render environment in
   * `notification.templates.builder.ts` is a bare non-autoescaping nunjucks
   * Environment that only guarantees `{{ }}` interpolation.
   */
  entryCount: number;
  /**
   * The fully resolved subject/title line (data-model §9.1 copy matrix).
   * Precomputed in the builder for the same reason as `entryCount`.
   */
  subjectLine: string;
}
