# Research: Space-Admin Email-Change Notification

**Branch**: `005-space-admin-email-change` | **Date**: 2026-05-20
**Spec**: [spec.md](./spec.md)
**Upstream**: the sibling server/client specs for this feature; the existing
email-change family ([specs/004-email-change-notifications](../004-email-change-notifications/)).

This document resolves the unknowns in the Technical Context before design. It
is grounded in a direct read of the current `notifications` codebase (May 2026)
and the 004 email-change feature it extends.

## Summary of decisions

| # | Topic | Decision |
|---|-------|----------|
| R1 | Wire payload shape | Extends `NotificationEventPayloadSpace`; event-specific fields mirror the 004 global-admin email-change payload (`subjectProfileSummary`, `oldEmail`, `newEmail`, `initiatorProfileSummary?`, `initiatorRole`, `commitTimestampISO8601`, `triggerOutcome`) — minus the informational `subjectMemberships`/`subjectGlobalRoles` |
| R2 | Event-name wire value (FR-016) | `USER_EMAIL_CHANGE_SPACE_ADMIN_NOTIFICATION` — sibling of `USER_EMAIL_CHANGE_GLOBAL_ADMIN_NOTIFICATION`. Confirmed: the server-side publisher registers exactly this literal |
| R3 | `NotificationEvent` enum | Add one member `UserEmailChangeSpaceAdminNotification` to `service/src/generated/alkemio-schema.ts` |
| R4 | Handler integration | Thin pass-through to `processNotificationEvent` — **no** normalization. The event carries the full `BaseEventPayload` envelope + a server-resolved `recipients` array |
| R5 | lib payload placement | `lib/src/dto/email-change/` — joins the 004 email-change family |
| R6 | Email-template payload base | Extends `BaseSpaceEmailPayload` so the message names the space (FR-005/FR-006) |
| R7 | Opt-out preference (FR-009/FR-010) | **Out of scope for this repo** — the server filters recipients by the preference before publishing; the client surfaces the toggle |
| R8 | Timestamp rendering | Reuse the existing `formatChangeTimestampUTC` helper — UTC, explicit label (FR-008) |
| R9 | Drift-detected outcome | Single routine message, **no** template variant (FR-014). `triggerOutcome` is carried on the wire payload for parity but is not consumed |
| R10 | Library versioning | Additive minor bump of `@alkemio/notifications-lib` (0.15.0 → 0.16.0) |

---

## R1 — Wire payload shape

**Decision**: The new payload type `NotificationEventPayloadUserEmailChangeSpaceAdmin`
**extends `NotificationEventPayloadSpace`** — the shared space-notification
payload (`BaseEventPayload` + `space: SpacePayload`). On top of that envelope it
carries the email-change-specific fields, mirroring the 004 global-admin
sibling (`NotificationEventPayloadUserEmailChangeGlobalAdmin`):
`subjectProfileSummary`, `oldEmail`, `newEmail`, `initiatorProfileSummary?`,
`initiatorRole`, `commitTimestampISO8601`, `triggerOutcome`. Field-by-field
detail is in [data-model.md](./data-model.md).

**Rationale**: The spec is explicit (Key Entities, Assumptions): the publisher
emits one event per qualifying space, each event extending the shared
space-notification payload and carrying exactly one space — modelled on the
space-community notifications (e.g. `SPACE_ADMIN_COMMUNITY_APPLICATION`), **not**
on the global-admin email-change shape (one event, flat platform-wide
recipients, a membership footprint). `NotificationEventPayloadSpace` is that
shared payload; `NotificationEventPayloadSpaceCommunityApplication` is the
precedent for extending it. The email-change *content* fields are identical in
meaning to the global-admin notification, so they are reused verbatim for
consistency across the email-change family.

**Excluded**: `subjectMemberships` / `subjectGlobalRoles` from the global-admin
payload — 004 carried them as "informational context only, not consumed". They
are irrelevant here: the event already carries its single space, and the message
body needs no membership footprint. Per YAGNI they are not declared.

**Alternatives considered**: Mirroring the global-admin payload directly (one
event, flat recipients) — rejected: the spec explicitly forbids that shape and
requires per-space events so each message names its space (FR-005).

## R2 — Event-name wire value (FR-016)

**Decision**: The event name is **`USER_EMAIL_CHANGE_SPACE_ADMIN_NOTIFICATION`**,
with enum member `UserEmailChangeSpaceAdminNotification`. The notifications
service listens for exactly this string.

**Rationale**: The 004 email-change family already establishes the
`USER_EMAIL_CHANGE_<audience>_NOTIFICATION` naming —
`USER_EMAIL_CHANGE_GLOBAL_ADMIN_NOTIFICATION` for platform admins. The spec
frames this feature as "a sibling of the existing email-change notifications",
so the space-admin audience yields `USER_EMAIL_CHANGE_SPACE_ADMIN_NOTIFICATION`.
The `SPACE_ADMIN_*` family (e.g. `SPACE_ADMIN_COMMUNITY_APPLICATION`) names the
*structural* model but not the wire value — naming follows the email-change
family.

**FR-016 obligation**: the value MUST match the publisher's wire value exactly.
The authoritative source is the server's `NotificationEvent` enum
(`server/src/common/enums/notification.event.ts`). The server-side publisher is
now implemented (on the server's `097-change-user-email` branch) and that enum
registers exactly `USER_EMAIL_CHANGE_SPACE_ADMIN_NOTIFICATION`, so the literal is
**confirmed**. `npm run codegen` against the server can re-confirm it. Were the
literal ever to change, this single string is updated in the enum, the
`@EventPattern`, and the two switch cases — the value is referenced through the
`NotificationEvent` enum member, so the change is localised.

## R3 — `NotificationEvent` enum

**Decision**: Add one member to the `NotificationEvent` enum in
`service/src/generated/alkemio-schema.ts`:
`UserEmailChangeSpaceAdminNotification = 'USER_EMAIL_CHANGE_SPACE_ADMIN_NOTIFICATION'`.

**Rationale**: The enum already carries the three 004 members
(`UserEmailChangeSecuritySignal`, `UserEmailChangeNewAddressNotification`,
`UserEmailChangeGlobalAdminNotification`) and the `SPACE_ADMIN_*` members. The
member was added manually; the value is fixed and known (R2) and matches the
server publisher's `NotificationEvent` enum exactly. `npm run codegen` against
the server can re-confirm it.

**Note**: Codegen also picks up unrelated schema drift; if used, review the diff
and keep it scoped to the one new member.

## R4 — Handler integration: thin pass-through, no normalization

**Decision**: The new `@EventPattern(NotificationEvent.UserEmailChangeSpaceAdminNotification)`
handler in `app.controller.ts` is a **thin pass-through** — it forwards the
payload straight to `processNotificationEvent`, exactly like
`sendSpaceCommunityApplicationAdminNotification` and
`sendUserEmailChangeGlobalAdminNotification`. There is **no** normalization step.

**Rationale**: 004 events 1 & 2 (`USER_EMAIL_CHANGE_SECURITY_SIGNAL`,
`USER_EMAIL_CHANGE_NEW_ADDRESS_NOTIFICATION`) are published *raw* and need
`normalizeRawEmailChangeEvent` to inject the `BaseEventPayload` envelope. This
event is different: it extends `NotificationEventPayloadSpace` → `BaseEventPayload`,
so the publisher emits it with `eventType`, `triggeredBy`, `platform`, `space`,
**and** a server-resolved `recipients` array already present. The existing
pipeline (`processNotificationEvent` → `buildAndSendEmailNotifications` →
blacklist filter → template lookup → send → ack/nack) then runs unchanged. This
matches 004 event 3 (global-admin), whose handler is likewise a pass-through.

**Consequence**: the notifications service performs **no** recipient resolution
and **no** fan-out across spaces. The server emits one event per qualifying
space; the service handles each independently. This satisfies FR-002, FR-004,
and FR-005 entirely from the server-resolved `recipients` array — the
service simply delivers to whoever is in it.

**Alternatives considered**: A separate per-space processing path in the service
— rejected: duplicates the ack/nack engine and contradicts the spec's explicit
"the notifications service neither resolves recipients nor fans out across
spaces" assumption.

## R5 — Library payload placement

**Decision**: The new payload type lives at
`lib/src/dto/email-change/notification.event.payload.user.email.change.space.admin.ts`,
exported from `lib/src/dto/index.ts`.

**Rationale**: The spec frames the feature as "a sibling of the existing
email-change notifications". The 004 feature created `lib/src/dto/email-change/`
for exactly this family; grouping the new type there keeps the email-change
family discoverable in one folder. The type imports `NotificationEventPayloadSpace`
from `../space/notification.event.payload.space` — a cross-folder import that is
already common in the DTO tree and carries no cost.

**Alternatives considered**: Placing it under `lib/src/dto/space/` because it is
structurally a space notification — rejected: feature-family grouping (the spec's
own framing) wins over structural grouping for discoverability, and the 004
folder already exists for this purpose.

## R6 — Email-template payload base

**Decision**: The new email-template payload `SpaceAdminUserEmailChangeEmailPayload`
**extends `BaseSpaceEmailPayload`** (`BaseEmailPayload` + a `space` block).

**Rationale**: FR-005/FR-006 require each message to name the space it concerns.
`BaseSpaceEmailPayload` supplies `space: { displayName, level, url, type }`, and
the existing `createSpaceBaseEmailPayload` builder helper populates it from
`eventPayload.space`. The 004 global-admin email-template payload extended the
plain `BaseEmailPayload` because it is platform-scoped; this feature is
space-scoped, so it follows the space-community notifications
(`CommunityApplicationCreatedEmailPayload extends BaseSpaceEmailPayload`) instead.
The email-change content fields (`subjectName`, `initiatorName`,
`isSelfInitiated`, `oldEmail`, `newEmail`, `changedAt`) mirror the global-admin
email-template payload.

## R7 — The opt-out preference (FR-009 / FR-010): out of scope for this repo

**Decision**: The notifications service implements **no** preference logic. It
consumes the `recipients` array on the event as-is. The new per-user opt-out
preference is satisfied entirely upstream:

- the **server** stores the preference, and resolves each space's admin/lead
  recipient set *with opted-out admins already excluded* before publishing;
- the **client** surfaces the toggle in the Space group of the
  notification-settings UI.

**Rationale**: This mirrors the 004 global-admin email-change event, whose
recipient set is "server-resolved … filtered by the admin-notification setting"
(004 research §R13). The notifications service has no authenticated GraphQL path
to read per-user preferences — its only GraphQL call (the blacklist sync) is
anonymous. The spec's own Assumptions confirm recipient resolution "does not
happen in the notifications service". Therefore FR-009/FR-010 generate **no**
tasks in this repo; they are tracked in the sibling server/client specs.

**Impact**: `/speckit.tasks` MUST NOT emit notifications-service tasks for the
preference. The only repo-side guarantee for FR-009 is the negative one: the
service delivers to exactly the recipients it is given and adds nobody.

## R8 — Timestamp rendering

**Decision**: Render `commitTimestampISO8601` via the existing
`NotificationEmailPayloadBuilderService.formatChangeTimestampUTC` helper — UTC,
with an explicit `UTC` label, e.g. `20 May 2026, 14:32 UTC`.

**Rationale**: FR-008 requires UTC, explicitly labelled, never a raw machine
timestamp. The helper was added in 004 for precisely this and is already used by
all three 004 email-change builders. Reuse it verbatim — no new formatting code.

## R9 — Drift-detected outcome: one message, no variant

**Decision**: The template renders a **single routine message** for both
`COMMITTED` and `DRIFT_DETECTED` outcomes. There is **no** drift variant and
**no** `triggerOutcome`-driven branching in the template or email-template
payload. `triggerOutcome` is carried on the *wire* payload (R1) for parity with
the global-admin event, but the service does not consume it.

**Rationale**: FR-014 is explicit — a drift-detected outcome "MUST still produce
this notification, using the same routine message as a clean commit — there is
no separate reconciliation-required variant"; the reconciliation framing is
reserved for platform staff (the global-admin notification) and is out of scope
here. Contrast with 004's global-admin template, which *does* branch on
`triggerOutcome`. Because the service produces the notification only when the
server publishes the event, and the server publishes only for committed/
drift-detected outcomes (FR-013), no consumer-side outcome guard is needed —
absence of an event is the contract for every other outcome.

## R10 — Library versioning

**Decision**: Additive **minor** bump of `@alkemio/notifications-lib`, `0.15.0`
→ `0.16.0`. One new payload type exported from `lib/src/dto/`; no existing type
changes. The service `package.json` dependency is bumped to `0.16.0` in lockstep.

**Rationale**: FR-015 — additive, no breaking changes. The repo is a two-package
monorepo, so the library bump and the consuming service change land together
(004 followed the same approach: `0.14.x` → `0.15.0`).

## Blacklist / unsubscribe filtering

**No change.** `NotificationBlacklistService.filterRecipients` keys on
`recipient.email` and already runs inside `buildAndSendEmailNotifications`.
Because this event flows through that method unchanged (R4), filtering applies
automatically (FR-011) — no new code.
