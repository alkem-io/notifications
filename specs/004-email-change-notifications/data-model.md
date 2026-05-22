# Data Model: Email-Change Notification Events

**Branch**: `004-email-change-notifications` | **Date**: 2026-05-20
**Inputs**: [spec.md](./spec.md), [research.md](./research.md)

This feature has no persistent storage. The "data model" is the set of typed
payloads that flow through three layers:

1. **Wire payloads** — published by the server, defined in `@alkemio/notifications-lib`.
2. **Normalized internal payload** — events 1 & 2 only; built at the handler.
3. **Email-template payloads** — consumed by the Nunjucks templates.

All three events are email-only in this release (FR-016).

---

## 1. Wire payloads — `@alkemio/notifications-lib`

New types under `lib/src/dto/user/`, exported from `lib/src/dto/index.ts`.
Naming follows the existing `notification.event.payload.*.ts` convention.

### 1.1 `NotificationEventPayloadUserEmailChangeSecuritySignal`

Event `USER_EMAIL_CHANGE_SECURITY_SIGNAL`. Published **raw** (no `BaseEventPayload`
wrapper — research.md §R2).

| Field | Type | Notes |
|-------|------|-------|
| `recipientEmail` | `string` | The **old** address. Delivery target. May no longer map to an active account. |
| `commitTimestampISO8601` | `string` | ISO 8601 UTC instant of the change. |
| `initiatorRole` | `'self' \| 'platform_admin'` | Lowercase wire values (research.md §R3). |
| `newEmailMasked` | `string` | e.g. `e***@c***.bg`. Rendered verbatim; never unmasked (FR-006). |

### 1.2 `NotificationEventPayloadUserEmailChangeNewAddress`

Event `USER_EMAIL_CHANGE_NEW_ADDRESS_NOTIFICATION`. Published **raw**.

| Field | Type | Notes |
|-------|------|-------|
| `recipientEmail` | `string` | The **new** address. Delivery target. |
| `commitTimestampISO8601` | `string` | ISO 8601 UTC instant. |
| `initiatorRole` | `'self' \| 'platform_admin'` | |
| `newEmailFull` | `string` | Full new address — recipient owns this mailbox (FR-008). |
| `loginUrl` | `string` | client-web login deep link. |

### 1.3 `NotificationEventPayloadUserEmailChangeGlobalAdmin`

Event `USER_EMAIL_CHANGE_GLOBAL_ADMIN_NOTIFICATION`. **Extends `BaseEventPayload`**
— published via the server's `buildBaseEventPayload` (research.md §R2, §R13).

Inherited from `BaseEventPayload`:

| Field | Type | Notes |
|-------|------|-------|
| `eventType` | `string` | `'USER_EMAIL_CHANGE_GLOBAL_ADMIN_NOTIFICATION'`. |
| `triggeredBy` | `UserPayload` | The initiating actor (server-populated). |
| `recipients` | `UserPayload[]` | **Server-resolved** platform-admin set, subject excluded (FR-009, 097 §R8). |
| `platform` | `{ url: string }` | |

Event-specific:

| Field | Type | Notes |
|-------|------|-------|
| `subjectProfileSummary` | `{ id: string; displayName: string }` | The user whose email changed. |
| `oldEmail` | `string` | Full — admin recipients trusted. |
| `newEmail` | `string` | Full. |
| `initiatorProfileSummary` | `{ id: string; displayName: string }` _(optional)_ | Absent for self-initiated; fall back to `subjectProfileSummary` (FR-019). |
| `initiatorRole` | `'self' \| 'platform_admin'` | |
| `commitTimestampISO8601` | `string` | ISO 8601 UTC instant. |
| `triggerOutcome` | `'COMMITTED' \| 'DRIFT_DETECTED'` | Uppercase wire values (research.md §R4). Drives the template variant (FR-011). |
| `subjectMemberships` | `{ spaces: {...}[]; organizations: {...}[] }` _(optional)_ | Informational context only; not consumed in this release. |
| `subjectGlobalRoles` | `string[]` _(optional)_ | Informational context only. |

> `subjectMemberships` / `subjectGlobalRoles` are carried for the email body's
> benefit only — they are **not** recipient-resolution inputs (resolution is
> server-side). They may be omitted entirely.

## 2. Normalized internal payload (events 1 & 2 only)

Events 1 & 2 arrive without an envelope. Each `@EventPattern` handler builds a
`BaseEventPayload`-compatible object so the existing
`processNotificationEvent` → `buildAndSendEmailNotifications` pipeline runs
unchanged (research.md §R5). Shape = the raw wire type **plus**:

| Injected field | Source |
|----------------|--------|
| `eventType` | The handler's own `@EventPattern` value. |
| `platform.url` | Config `alkemio.webclient_endpoint` (research.md §R7). |
| `triggeredBy` | Minimal `UserPayload` stub — required by `BaseEventPayload`, unused by the email-change builders. |
| `recipients` | `[ syntheticUser ]` (§3). |

Event 3 needs **no** normalization — its wire payload is already a full
`BaseEventPayload`.

## 3. Synthetic recipient (events 1 & 2)

The `recipients` array for events 1 & 2 holds one entry, derived from
`recipientEmail`:

| Field | Value |
|-------|-------|
| `email` | `payload.recipientEmail` |
| `firstName` | `''` |
| `lastName` | `''` |
| `profile` | `{ displayName: '', url: '' }` |
| `id` | omitted — so `createUserNotificationPreferencesURL` returns `''` (research.md §R8) |

Blacklist filtering (`NotificationBlacklistService.filterRecipients`) keys on
`email` and applies normally (FR-012, research.md §R14).

## 4. Email-template payloads — `service/`

New interfaces under `service/src/services/notification/email-template-payload/`,
each extending `BaseEmailPayload` (`platform.url` + `recipient.{firstName, email,
notificationPreferences}`), exported from that folder's `index.ts`. Built by new
methods on `NotificationEmailPayloadBuilderService`.

### 4.1 `UserEmailChangeSecuritySignalEmailPayload`

Template `user.email.change.security.signal`.

| Field | Type | Derivation |
|-------|------|-----------|
| `changedAt` | `string` | `commitTimestampISO8601` formatted UTC (research.md §R9). |
| `initiatorRole` | `'self' \| 'platform_admin'` | Passthrough; template picks "you" vs "a platform administrator". |
| `newEmailMasked` | `string` | Passthrough — verbatim (FR-006). |

### 4.2 `UserEmailChangeNewAddressEmailPayload`

Template `user.email.change.new.address`.

| Field | Type | Derivation |
|-------|------|-----------|
| `changedAt` | `string` | Formatted UTC. |
| `initiatorRole` | `'self' \| 'platform_admin'` | Passthrough. |
| `newEmailFull` | `string` | Passthrough. |
| `loginUrl` | `string` | Passthrough. |

### 4.3 `PlatformAdminUserEmailChangeEmailPayload`

Template `platform.admin.user.email.change`.

| Field | Type | Derivation |
|-------|------|-----------|
| `subjectName` | `string` | `subjectProfileSummary.displayName`. |
| `initiatorName` | `string` | `initiatorProfileSummary?.displayName ?? subjectProfileSummary.displayName` (FR-019 fallback). |
| `isSelfInitiated` | `boolean` | `initiatorRole === 'self'` — template adds the explicit self-initiation indicator (FR-019). |
| `oldEmail` | `string` | Passthrough — full. |
| `newEmail` | `string` | Passthrough — full. |
| `changedAt` | `string` | Formatted UTC. |
| `triggerOutcome` | `'COMMITTED' \| 'DRIFT_DETECTED'` | Template branches: routine vs reconciliation-required (FR-011). |

## 5. Validation rules

- `initiatorRole` MUST be one of `'self'` / `'platform_admin'`; any other value
  is a malformed event.
- `triggerOutcome` MUST be `'COMMITTED'` / `'DRIFT_DETECTED'`. The server only
  publishes event 3 for these two outcomes (FR-014); no other value should
  appear, and no email-change email is produced for any other outcome.
- `changedAt` MUST render in UTC with the `UTC` label and MUST NOT be a raw ISO
  string (FR-018).
- The security-signal payload/template MUST NOT contain `newEmailFull` /
  `newEmail` in any form (FR-006).

## 6. Event → builder → template map

| Event | Builder method (`NotificationEmailPayloadBuilderService`) | Template file |
|-------|----------------------------------------------------------|---------------|
| `USER_EMAIL_CHANGE_SECURITY_SIGNAL` | `createEmailTemplatePayloadUserEmailChangeSecuritySignal` | `user.email.change.security.signal.js` |
| `USER_EMAIL_CHANGE_NEW_ADDRESS_NOTIFICATION` | `createEmailTemplatePayloadUserEmailChangeNewAddress` | `user.email.change.new.address.js` |
| `USER_EMAIL_CHANGE_GLOBAL_ADMIN_NOTIFICATION` | `createEmailTemplatePayloadPlatformAdminUserEmailChange` | `platform.admin.user.email.change.js` |
