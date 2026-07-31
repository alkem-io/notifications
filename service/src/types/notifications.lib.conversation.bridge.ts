import { BaseEventPayload } from '@alkemio/notifications-lib';

/**
 * TEMPORARY INLINE BRIDGE — 034-messaging-notifications (contract C-3).
 *
 * These two interfaces are declared here, verbatim copies of
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

/**
 * Wire payload for a group conversation message notification. Sibling of
 * `NotificationEventPayloadUserConversationMessageDirect`; adds
 * `conversation.displayName` since group email/push copy names the
 * conversation. NO message-content field exists on this DTO (FR-008).
 */
export interface NotificationEventPayloadUserConversationMessageGroup extends BaseEventPayload {
  sender: { displayName: string };
  conversation: { id: string; url: string; displayName: string };
}
