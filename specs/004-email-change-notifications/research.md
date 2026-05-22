# Research: Email-Change Notification Events

**Branch**: `004-email-change-notifications` | **Date**: 2026-05-20
**Spec**: [spec.md](./spec.md)
**Upstream**: server spec 097 — `prd-notifications-email-change.md`, `research.md §R8`, `spec.md §FR-016d`

This document resolves the unknowns in the Technical Context before design. It
is grounded in a direct read of the current `notifications` and `server`
codebases (May 2026), not on the PRD prose alone — several PRD statements were
found inaccurate and are corrected below.

## Summary of decisions

| # | Topic | Decision |
|---|-------|----------|
| R1 | Wire payload shapes | Confirmed from server `notification.payloads.ts` + `NotificationExternalAdapter` |
| R2 | Payload envelope | Events 1 & 2 publish **raw** (no `eventType`/`recipients`/`platform`); event 3 publishes via `buildBaseEventPayload` (has the wrapper) |
| R3 | `initiatorRole` values | Lowercase `'self'` / `'platform_admin'` on the wire — the PRD's `'SELF'`/`'PLATFORM_ADMIN'` is wrong |
| R4 | `triggerOutcome` values | Uppercase `'COMMITTED'` / `'DRIFT_DETECTED'` |
| R5 | Pipeline integration | Events 1 & 2: normalize the raw payload at the handler, then reuse `processNotificationEvent` unchanged. Event 3: mirror `PLATFORM_ADMIN_GLOBAL_ROLE_CHANGED` exactly |
| R6 | `NotificationEvent` enum | Add the three members to `service/src/generated/alkemio-schema.ts` (codegen or manual) |
| R7 | `platform.url` for events 1 & 2 | From config `alkemio.webclient_endpoint` |
| R8 | Synthetic recipient | Events 1 & 2 carry only an email string — synthesize a single-element recipient list |
| R9 | Timestamp rendering | UTC, explicit "UTC" label (e.g. `20 May 2026, 14:32 UTC`) |
| R10 | Masked address | Render `newEmailMasked` verbatim — never reconstruct/unmask |
| R11 | Drift variant | The global-admin template branches on `triggerOutcome` |
| R12 | Library versioning | Additive minor bump of `@alkemio/notifications-lib` |
| R13 | Server follow-up | Event 3 depends on a server change (per revised 097 §R8) before it can be validated end-to-end |
| R14 | Blacklist / unsubscribe | Existing `NotificationBlacklistService.filterRecipients` applies unchanged to all three events |

---

## R1 — Wire payload shapes

**Decision**: Adopt the exact shapes published by the server. Source of truth:
`server/src/domain/community/user-email-change/dto/notification.payloads.ts`
and `server/src/services/adapters/notification-external-adapter/notification.external.adapter.ts`.

- **`USER_EMAIL_CHANGE_SECURITY_SIGNAL`** → `{ recipientEmail, commitTimestampISO8601, initiatorRole, newEmailMasked }`
- **`USER_EMAIL_CHANGE_NEW_ADDRESS_NOTIFICATION`** → `{ recipientEmail, commitTimestampISO8601, initiatorRole, newEmailFull, loginUrl }`
- **`USER_EMAIL_CHANGE_GLOBAL_ADMIN_NOTIFICATION`** → (after the server follow-up, R13) a `BaseEventPayload` wrapper (`eventType`, `triggeredBy`, `recipients`, `platform`) **plus** `{ subjectProfileSummary, oldEmail, newEmail, initiatorProfileSummary?, initiatorRole, commitTimestampISO8601, triggerOutcome, subjectMemberships?, subjectGlobalRoles? }`

**Rationale**: The shared library is the wire contract; it must mirror what the
publisher emits. Field-by-field detail is in [data-model.md](./data-model.md).

**Alternatives considered**: Trusting the PRD §2 interfaces verbatim — rejected,
they contained two inaccuracies (R3, and event 3's envelope before the §R8
revision).

## R2 — Payload envelope: raw vs. `BaseEventPayload`

**Decision**: Events 1 & 2 are published **raw** — the server's
`publishEmailChangeSecuritySignal(payload)` / `…NewAddressNotification(payload)`
call `notificationsClient.emit(event, payload)` with the raw object and do
**not** route through `buildBaseEventPayload`. So the wire payload has **no**
`eventType`, `recipients`, `triggeredBy`, or `platform`. Event 3, after the
server follow-up (R13), **does** route through `buildBaseEventPayload` and
therefore carries the full base wrapper including a resolved `recipients` array.

**Rationale**: Verified directly in `notification.external.adapter.ts` — the
three `publishEmailChange*` helpers pass `payload: unknown` straight to
`sendExternalNotifications`, unlike every other `build*Payload` method which
composes `buildBaseEventPayload`. This asymmetry drives R5.

**Impact**: The notifications service's existing pipeline
(`processNotificationEvent` → `buildAndSendEmailNotifications`) assumes
`payload.eventType` and a non-empty `payload.recipients`. Events 1 & 2 satisfy
neither and need a normalization step (R5).

## R3 — `initiatorRole` wire values

**Decision**: The wire values are lowercase **`'self'`** and
**`'platform_admin'`**. The library type MUST use these literals.

**Rationale**: `server/.../enums/user.email.change.initiator.role.ts` defines
`UserEmailChangeInitiatorRole { SELF = 'self', PLATFORM_ADMIN = 'platform_admin' }`.
A TypeScript enum serialises to its **value** over JSON/AMQP, so `'self'` /
`'platform_admin'` reach the wire. The PRD §2 (`'SELF' | 'PLATFORM_ADMIN'`) and
the original 004 spec FR-019 (`SELF`) describe the GraphQL enum *member names*,
not the wire values — they are corrected in the 097 PRD.

**Impact**: Template/initiator-context logic compares against `'self'` /
`'platform_admin'`. Comparing against uppercase would silently fall through to
the "platform administrator" branch for self-initiated changes.

## R4 — `triggerOutcome` wire values

**Decision**: Uppercase `'COMMITTED'` / `'DRIFT_DETECTED'`.

**Rationale**: `UserEmailChangeTriggerOutcome` in `notification.payloads.ts` is a
plain string-literal union (`'COMMITTED' | 'DRIFT_DETECTED'`), not an enum — the
literals themselves are the wire values.

## R5 — Integrating the events into the existing pipeline

**Decision**:

- **Events 1 & 2** — each `@EventPattern` handler **normalizes** the raw payload
  into a `BaseEventPayload`-shaped object before delegating to
  `processNotificationEvent`:
  - inject `eventType` (the handler knows its own `@EventPattern` value);
  - inject `platform: { url }` from config (R7);
  - inject a minimal `triggeredBy` stub (unused by the email-change builders,
    but `BaseEventPayload` requires the field);
  - synthesize `recipients: [ syntheticUser ]` from `recipientEmail` (R8).
  Everything downstream (`buildAndSendEmailNotifications`, blacklist filter,
  template lookup, send, ack/nack) then runs **unchanged**.
- **Event 3** — the handler is a thin pass-through to `processNotificationEvent`,
  exactly mirroring `sendPlatformGlobalRoleChangeNotification`: the payload
  already has `eventType` + `recipients` + `platform`, so no normalization is
  needed.

**Rationale**: Reuses the proven send/ack/nack engine for all three events; the
only genuinely new logic is the small per-handler normalization for events 1 & 2.
A single switch case per event in `createEmailPayloadForEvent` and
`getEmailTemplateToUseForEvent` completes the wiring — matching the documented
"add a notification" recipe in `CLAUDE.md`.

**Alternatives considered**:
- A wholly separate `processEmailChangeEvent` path — rejected: duplicates the
  ack/nack logic and diverges from the existing architecture for no benefit.
- Making `buildAndSendEmailNotifications` tolerate a missing `recipients` —
  rejected: spreads email-change-specific concerns across the generic engine;
  normalization at the edge keeps the core untouched (protects FR-015/SC-007,
  no regression to existing flows).

**Precedent**: `NotificationExternalAdapter.buildSpaceCommunityExternalInvitationCreatedNotificationPayload`
(server) already constructs a synthetic single-element `recipients` array from a
bare email — the same shape used here for events 1 & 2.

## R6 — `NotificationEvent` enum

**Decision**: Add three members to the `NotificationEvent` enum in
`service/src/generated/alkemio-schema.ts`:
`UserEmailChangeSecuritySignal = 'USER_EMAIL_CHANGE_SECURITY_SIGNAL'`,
`UserEmailChangeNewAddressNotification = 'USER_EMAIL_CHANGE_NEW_ADDRESS_NOTIFICATION'`,
`UserEmailChangeGlobalAdminNotification = 'USER_EMAIL_CHANGE_GLOBAL_ADMIN_NOTIFICATION'`.

**Rationale**: The server already registers these in its GraphQL
`NotificationEvent` enum (`server/src/common/enums/notification.event.ts`,
`registerEnumType`). `npm run codegen` against a server running spec 097 is the
canonical regeneration path. Manual addition of the three members is an
acceptable, deterministic fallback when a 097-bearing server is not reachable —
the values are fixed and known.

**Note**: Codegen also picks up unrelated schema drift; if used, review the diff
and keep it scoped.

## R7 — `platform.url` for events 1 & 2

**Decision**: For the normalized events 1 & 2, set `platform.url` from config
`alkemio.webclient_endpoint` (`ConfigurationTypes.ALKEMIO`).

**Rationale**: The shared `_layouts` / footer template blocks reference
`platform.url`. Events 1 & 2 do not carry it (R2). `webclient_endpoint` is the
user-facing web client host and is already configured (`notifications.yml`).

## R8 — Synthetic recipient for events 1 & 2

**Decision**: Events 1 & 2 deliver to exactly one address —
`payload.recipientEmail`. Normalization synthesizes a one-element recipient list
whose `User` carries only `email`; no `id`/`profile`, so
`createUserNotificationPreferencesURL` yields an empty preferences link.

**Rationale**: The payload carries an email string, not a user record — the old
address may no longer map to any active account, and the service has no
authenticated way to look one up (it never resolves identities). An empty
notification-preferences link is correct: there is no user-settings page to link
to. Blacklist filtering still applies — it keys on the email (R14).

## R9 — Timestamp rendering

**Decision**: Render `commitTimestampISO8601` in **UTC** with an explicit
`UTC` label, e.g. `20 May 2026, 14:32 UTC`. Build it with
`new Date(iso).toLocaleString('en-GB', { timeZone: 'UTC', day/month/year/hour/minute })`
and append `" UTC"`.

**Rationale**: spec.md FR-018 + clarification 2026-05-20. The raw ISO string MUST
NOT be shown, and no other timezone may be used. `platform.space.created`
already formats with `{ timeZone: 'UTC' }` — same approach.

## R10 — Masked new address (security signal)

**Decision**: The security-signal template renders `newEmailMasked` exactly as
received. No unmasking, no reconstruction, and the full new address
(`newEmailFull` / `newEmail`) is never present in that payload or template.

**Rationale**: spec.md FR-006/SC-004 — the old mailbox may be controlled by a
hostile party. The server masks; the service only displays.

## R11 — Drift-detected variant (global-admin)

**Decision**: The `platform.admin.user.email.change` template branches on
`triggerOutcome`: `COMMITTED` → routine confirmation; `DRIFT_DETECTED` →
reconciliation-required action-item phrasing.

**Rationale**: spec.md FR-011/SC-005. A single template with a conditional block
keeps it to one file; the outcome is a plain payload field.

## R12 — Library versioning

**Decision**: Additive minor bump of `@alkemio/notifications-lib` (current
`0.14.2`). Three new payload types exported from `lib/src/dto/`; no existing type
changes. The service `package.json` dependency is bumped in lockstep.

**Rationale**: spec.md FR-013 — additive, no breaking changes. The repo is a
two-package monorepo, so the bump and the consuming change land together.

## R13 — Server follow-up dependency (event 3)

**Decision**: Event 3 (global-admin) end-to-end depends on a **server-side
follow-up**: the server must publish `USER_EMAIL_CHANGE_GLOBAL_ADMIN_NOTIFICATION`
through `NotificationRecipientsService` + `buildBaseEventPayload` so the payload
carries a resolved `recipients` array (per the revised 097 §R8 / §FR-016d).

**Rationale**: The notifications service has no authenticated GraphQL path to
resolve platform admins itself (its only GraphQL call, the blacklist sync, is
anonymous; admin emails are privileged). Recipient resolution therefore happens
server-side — see 097 `research.md §R8`. The server currently still publishes
event 3 with the older footprint-only shape; that is tracked as a 097 follow-up.

**Impact on this feature**: Events 1 & 2 (both P1) have **no** such dependency
and can ship and be validated immediately. Event 3 (P2) handler/template/builder
can be built and unit-tested against the target payload now, but its end-to-end
quickstart check is blocked until the server follow-up lands.

## R14 — Blacklist / unsubscribe filtering

**Decision**: No change. `NotificationBlacklistService.filterRecipients(User[])`
already keys on `recipient.email` and runs inside `buildAndSendEmailNotifications`;
because all three events flow through that method (R5), filtering applies
automatically — including to the synthesized single recipients of events 1 & 2.

**Rationale**: spec.md FR-012/SC — existing behavior, reused for free.
