# Data Model: Space-Admin Email-Change Notification

**Branch**: `005-space-admin-email-change` | **Date**: 2026-05-20
**Inputs**: [spec.md](./spec.md), [research.md](./research.md)

This feature has no persistent storage. The "data model" is the set of typed
payloads that flow through two layers:

1. **Wire payload** — published by the server, defined in `@alkemio/notifications-lib`.
2. **Email-template payload** — consumed by the Nunjucks template.

There is **no** normalized internal payload — unlike 004 events 1 & 2, this
event arrives with the full `BaseEventPayload` envelope already in place
(research.md §R4). The event is email-only this release (FR-012).

---

## 1. Wire payload — `@alkemio/notifications-lib`

New type at `lib/src/dto/email-change/notification.event.payload.user.email.change.space.admin.ts`,
exported from `lib/src/dto/index.ts`. Naming follows the existing
`notification.event.payload.*.ts` convention and the 004 email-change family.

### `NotificationEventPayloadUserEmailChangeSpaceAdmin`

Event `USER_EMAIL_CHANGE_SPACE_ADMIN_NOTIFICATION` (research.md §R2). **Extends
`NotificationEventPayloadSpace`** — the shared space-notification payload —
published via the server's `buildBaseEventPayload`, one event per qualifying
space.

Inherited from `NotificationEventPayloadSpace` (→ `BaseEventPayload`):

| Field | Type | Notes |
|-------|------|-------|
| `eventType` | `string` | `'USER_EMAIL_CHANGE_SPACE_ADMIN_NOTIFICATION'`. |
| `triggeredBy` | `UserPayload` | The initiating actor (server-populated). Required by `BaseEventPayload`; **not consumed** by this builder — initiator display uses `initiatorProfileSummary` instead (see §3). |
| `recipients` | `UserPayload[]` | **Server-resolved**: the admins and leads of `space`, with the subject excluded and opted-out admins already filtered out (FR-002, FR-004, FR-009). The service delivers to this set as-is. |
| `platform` | `{ url: string }` | Web client host — used by the shared footer block. |
| `space` | `SpacePayload` | The **one** space this event concerns: `{ id, level, profile: { displayName, url }, adminURL }`. |

Event-specific (mirrors the 004 global-admin email-change payload — research.md §R1):

| Field | Type | Notes |
|-------|------|-------|
| `subjectProfileSummary` | `{ id: string; displayName: string }` | The user whose login email changed (the affected user). |
| `oldEmail` | `string` | Full old address — space admins/leads are trusted recipients (FR-007). |
| `newEmail` | `string` | Full new address (FR-007). |
| `initiatorProfileSummary` | `{ id: string; displayName: string }` _(optional)_ | Absent for a self-initiated change; the builder falls back to `subjectProfileSummary` (FR-006 — "who initiated the change"). |
| `initiatorRole` | `'self' \| 'platform_admin'` | Lowercase wire values (004 research §R3). Drives the self-initiation indicator. |
| `commitTimestampISO8601` | `string` | ISO 8601 UTC instant of the change. |
| `triggerOutcome` | `'COMMITTED' \| 'DRIFT_DETECTED'` | Uppercase wire values. Carried for parity with the global-admin event; **not consumed** — there is no drift variant (FR-014, research.md §R9). |

> The 004 global-admin payload's `subjectMemberships` / `subjectGlobalRoles` are
> **deliberately not declared** here — they were "informational only, not
> consumed", and are irrelevant: the event already carries its single `space`
> (research.md §R1).

## 2. No normalization

004 events 1 & 2 arrive raw and are reshaped by
`NotificationService.normalizeRawEmailChangeEvent`. This event does **not** need
that: extending `NotificationEventPayloadSpace` means the publisher emits
`eventType`, `triggeredBy`, `recipients`, `platform`, and `space` directly. The
`@EventPattern` handler forwards the payload unchanged to
`processNotificationEvent` (research.md §R4).

## 3. Email-template payload — `service/`

New interface at
`service/src/services/notification/email-template-payload/space.admin.user.email.change.email.payload.ts`,
exported from that folder's `index.ts`. Built by a new method on
`NotificationEmailPayloadBuilderService`.

### `SpaceAdminUserEmailChangeEmailPayload`

Template `space.admin.user.email.change`. **Extends `BaseSpaceEmailPayload`**
(research.md §R6).

Inherited from `BaseSpaceEmailPayload`:

| Field | Type | Derivation |
|-------|------|-----------|
| `platform.url` | `string` | Passthrough from `eventPayload.platform.url`. |
| `recipient.firstName` | `string` | From the per-recipient `User`. |
| `recipient.email` | `string` | From the per-recipient `User`. |
| `recipient.notificationPreferences` | `string` | `…/settings/notifications` URL via `createUserNotificationPreferencesURL`. |
| `space.displayName` | `string` | `eventPayload.space.profile.displayName`. |
| `space.level` | `string` | `eventPayload.space.level`. |
| `space.url` | `string` | `eventPayload.space.profile.url`. |
| `space.type` | `string` | `'space'` if `level === '0'`, else `'subspace'`. |

All eight inherited fields are produced by the existing `createSpaceBaseEmailPayload`
helper — no new code.

Event-specific:

| Field | Type | Derivation |
|-------|------|-----------|
| `subjectName` | `string` | `subjectProfileSummary.displayName`. |
| `initiatorName` | `string` | `initiatorProfileSummary?.displayName ?? subjectProfileSummary.displayName` (FR-006 fallback for self-initiated). |
| `isSelfInitiated` | `boolean` | `initiatorRole === 'self'` — the template adds the explicit self-initiation indicator. |
| `oldEmail` | `string` | Passthrough — full (FR-007). |
| `newEmail` | `string` | Passthrough — full (FR-007). |
| `changedAt` | `string` | `commitTimestampISO8601` formatted via `formatChangeTimestampUTC` — UTC, explicit label (FR-008, research.md §R8). |

> `triggerOutcome` is **not** in the email-template payload — the message is the
> same for committed and drift-detected outcomes (FR-014, research.md §R9).

## 4. Validation rules

- `initiatorRole` MUST be one of `'self'` / `'platform_admin'`; any other value
  is a malformed event.
- `triggerOutcome` MUST be `'COMMITTED'` / `'DRIFT_DETECTED'`. The server only
  publishes this event for those two outcomes (FR-013); no consumer-side guard
  is required — absence of an event is the contract for every other outcome.
- `changedAt` MUST render in UTC with the `UTC` label and MUST NOT be a raw ISO
  string (FR-008).
- `recipients` is consumed exactly as received — the service adds no recipient
  and resolves none. Correctness of FR-002/FR-004/FR-009 rests on the
  server-resolved set (research.md §R4, §R7).
- Each event carries exactly one `space`; the service does not aggregate or fan
  out across spaces (FR-005).

## 5. Event → builder → template map

| Event | Builder method (`NotificationEmailPayloadBuilderService`) | Template file |
|-------|----------------------------------------------------------|---------------|
| `USER_EMAIL_CHANGE_SPACE_ADMIN_NOTIFICATION` | `createEmailTemplatePayloadSpaceAdminUserEmailChange` | `space.admin.user.email.change.js` |

## 6. Out of scope — the opt-out preference

The new per-user opt-out preference (FR-009/FR-010) has **no representation in
this repo**. The server stores it and resolves `recipients` with opted-out
admins already excluded; the client surfaces the toggle. The notifications
service models only what is on the wire — and the preference never reaches the
wire as a distinct field (research.md §R7).
