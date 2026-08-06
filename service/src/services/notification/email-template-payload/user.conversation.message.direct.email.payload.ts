import { BaseEmailPayload } from './base.email.payload';

/**
 * 034-messaging-notifications (contract C-2, FR-008/FR-009/D-15), revised for
 * Operator Ruling R4 — this is a DIGEST payload, not a single-message one.
 *
 * NO message-content field on this payload; only counterpart display names,
 * their unread counts, and per-conversation deep links. NO email field for any
 * sender either (`replyTo` is never set on this template; a sender's email
 * address is never disclosed to the recipient).
 */
export interface UserConversationMessageDirectEmailPayload extends BaseEmailPayload {
  /** One row per 1:1 counterpart with unread messages. Never empty. */
  senders: { displayName: string; count: number; url: string }[];
  /** Sum of `senders[].count`. */
  totalCount: number;
  /**
   * Precomputed for the template: `senders.length`. Templates must not compute
   * it — the plain-text (subject/title) render environment in
   * `notification.templates.builder.ts` is a bare non-autoescaping nunjucks
   * Environment that only guarantees `{{ }}` interpolation.
   */
  entryCount: number;
  /**
   * The fully resolved subject/title line (data-model §9.1 copy matrix).
   * Precomputed in the builder for the same reason as `entryCount`: the
   * six-case plural branching must not live in the plain-text environment.
   */
  subjectLine: string;
}
