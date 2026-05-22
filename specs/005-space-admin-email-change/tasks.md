---
description: "Task list for Space-Admin Email-Change Notification"
---

# Tasks: Space-Admin Email-Change Notification

**Input**: Design documents from `/specs/005-space-admin-email-change/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/events.md, quickstart.md

**Tests**: One targeted unit-coverage task (T013) is included because plan.md's
"Project Structure" explicitly lists `notification.service.spec.ts` as MODIFIED
for "unit coverage for the new event". It is targeted coverage of the new
builder method — **not** a TDD-first approach. The feature specification
requests no broader automated tests; the remaining validation is the quickstart
Path A checks (T014) plus a regression pass over the existing Jest suite (T017).

**Organization**: Tasks are grouped by user story so each story can be
implemented, validated, and delivered as an independent increment.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different file, no dependency on an incomplete task)
- **[Story]**: `[US1]` / `[US2]` — maps the task to a user story
- Every task names the exact file path it touches

## Path Conventions

Two-package monorepo (plan.md "Project Structure"):

- `lib/` — `@alkemio/notifications-lib` (shared wire payload types)
- `service/` — `alkemio-notifications` NestJS RabbitMQ consumer

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Capture the pre-change baseline.

- [X] T001 Establish the no-regression baseline: run `npm run build` in `lib/`, then `npm run build` and `npm test` in `service/`, and confirm all succeed on a clean `005-space-admin-email-change` checkout before any changes (baseline evidence for FR-015 / SC-006). No directory scaffolding is needed — `lib/src/dto/email-change/` already exists from the 004 feature.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The `@alkemio/notifications-lib` data contract, the library version
bump, and the `NotificationEvent` enum member — the shared changes every
service-side task depends on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T002 [P] Create the wire payload type `NotificationEventPayloadUserEmailChangeSpaceAdmin` in `lib/src/dto/email-change/notification.event.payload.user.email.change.space.admin.ts` — **extends `NotificationEventPayloadSpace`** (import from `../space/notification.event.payload.space`). Event-specific fields: `subjectProfileSummary: { id: string; displayName: string }`, `oldEmail: string`, `newEmail: string`, `initiatorProfileSummary?: { id: string; displayName: string }`, `initiatorRole: 'self' | 'platform_admin'`, `commitTimestampISO8601: string`, `triggerOutcome: 'COMMITTED' | 'DRIFT_DETECTED'` (data-model.md §1, research.md §R1). Do NOT declare `subjectMemberships` / `subjectGlobalRoles` — deliberately excluded (research.md §R1).
- [X] T003 Export the new type from `lib/src/dto/index.ts` — add `export * from './email-change/notification.event.payload.user.email.change.space.admin';` alongside the existing three email-change exports. Depends on T002.
- [X] T004 [P] Bump `version` in `lib/package.json` from `0.15.0` to `0.16.0` — additive minor bump, one new payload type, no existing type changes (research.md §R10, FR-015).
- [X] T005 [P] Add one member to the `NotificationEvent` enum in `service/src/generated/alkemio-schema.ts`: `UserEmailChangeSpaceAdminNotification = 'USER_EMAIL_CHANGE_SPACE_ADMIN_NOTIFICATION'` (research.md §R2/§R3). The wire value MUST match the publisher exactly (FR-016). The server-side publisher is now implemented (on the server's `097-change-user-email` branch) and registers exactly `USER_EMAIL_CHANGE_SPACE_ADMIN_NOTIFICATION` in its `NotificationEvent` enum, so the literal is **confirmed**. The member was added manually; `npm run codegen` against the server can re-confirm it (review the diff and keep it scoped to this one member).
- [X] T006 Make `@alkemio/notifications-lib@0.16.0` resolvable to `service/`: set the `@alkemio/notifications-lib` dependency in `service/package.json` from `0.15.0` to `0.16.0`, run `npm run build` in `lib/`, then make `0.16.0` resolvable to `service/` (`npm pack` in `lib/` + install the tarball into `service/`, or `npm link`) — `service/` consumes the library as a versioned dependency, not a workspace link. Depends on T002, T003, T004.

**Checkpoint**: The library data contract (`@alkemio/notifications-lib@0.16.0`) and the `NotificationEvent` enum member are in place and resolvable to `service/` — the service-side notification wiring (User Story 1) can now begin.

---

## Phase 3: User Story 1 - Space admins learn that a member's login email changed (Priority: P1) 🎯 MVP

**Goal**: When a user's login email changes, the admins and leads of every space
that user is a member of receive one email per space — naming the affected
user, the space, who initiated the change (self vs. a platform
administrator), the full old and new addresses, and the UTC change time. The
notifications service handles the new `USER_EMAIL_CHANGE_SPACE_ADMIN_NOTIFICATION`
event as a thin pass-through, delivering to the server-resolved `recipients`
array as-is — no recipient resolution and no fan-out in this service.

**Independent Test**: Publish a `USER_EMAIL_CHANGE_SPACE_ADMIN_NOTIFICATION`
event (quickstart.md Path A Scenario 1) and confirm one email per `recipients`
entry, each naming the subject, the space, the initiator, the full old and new
addresses, and the UTC-formatted change time — with no "unsupported event" log
line.

### Implementation for User Story 1

- [X] T007 [P] [US1] Create the email-template payload interface `SpaceAdminUserEmailChangeEmailPayload` **extending `BaseSpaceEmailPayload`** in `service/src/services/notification/email-template-payload/space.admin.user.email.change.email.payload.ts` (import `BaseSpaceEmailPayload` from `./base.space.email.payload`). Event-specific fields: `subjectName: string`, `initiatorName: string`, `isSelfInitiated: boolean`, `oldEmail: string`, `newEmail: string`, `changedAt: string` (data-model.md §3). Do NOT include `triggerOutcome` — the message is identical for committed and drift-detected outcomes (FR-014, research.md §R9).
- [X] T008 [US1] Export `SpaceAdminUserEmailChangeEmailPayload` from `service/src/services/notification/email-template-payload/index.ts`. Depends on T007.
- [X] T009 [US1] Add builder method `createEmailTemplatePayloadSpaceAdminUserEmailChange(eventPayload, recipient)` to `service/src/services/notification/notification.email.payload.builder.service.ts`, typing `eventPayload` as `NotificationEventPayloadUserEmailChangeSpaceAdmin`. Populate the inherited `BaseSpaceEmailPayload` fields via the existing `createSpaceBaseEmailPayload` helper; set `subjectName` from `subjectProfileSummary.displayName`, `initiatorName` from `initiatorProfileSummary?.displayName ?? subjectProfileSummary.displayName` (FR-006 self-initiated fallback), `isSelfInitiated` from `initiatorRole === 'self'`; format `commitTimestampISO8601` into `changedAt` via the existing `formatChangeTimestampUTC` helper (UTC, explicit "UTC" label — FR-008, research.md §R8); pass `oldEmail` and `newEmail` through verbatim — full addresses (FR-007). Depends on T002, T007.
- [X] T010 [P] [US1] Create the Nunjucks email template `service/src/email-templates/space.admin.user.email.change.js` — states the named user's login email was changed and names the `space` it concerns; shows `subjectName`, the `space` block (displayName / url), `initiatorName`, the full `oldEmail` and `newEmail`, and `changedAt`; when `isSelfInitiated` is true renders the explicit self-initiation indicator ("changed it themselves" vs. "changed by a platform administrator" — FR-006). One routine message only — NO `triggerOutcome` branch and NO reconciliation-required variant (FR-014, research.md §R9). Follow an existing space-scoped template such as `service/src/email-templates/user.space.community.application.submitted.js` for the space/header/footer blocks and `service/src/email-templates/platform.admin.user.email.change.js` for the email-change content.
- [X] T011 [P] [US1] Add the `@EventPattern(NotificationEvent.UserEmailChangeSpaceAdminNotification)` handler `sendUserEmailChangeSpaceAdminNotification` to `service/src/app.controller.ts` — a thin pass-through that delegates the `NotificationEventPayloadUserEmailChangeSpaceAdmin` payload straight to `notificationService.processNotificationEvent(eventPayload, context)` with NO normalization (the payload already carries the full `BaseEventPayload` envelope + a server-resolved `recipients` array), mirroring the existing `sendUserEmailChangeGlobalAdminNotification` handler. Add the import for `NotificationEventPayloadUserEmailChangeSpaceAdmin` from `@alkemio/notifications-lib`. Depends on T002, T005.
- [X] T012 [US1] Add the space-admin cases to the two switch statements in `service/src/services/notification/notification.service.ts`: in `createEmailPayloadForEvent` add `case NotificationEvent.UserEmailChangeSpaceAdminNotification:` returning the T009 builder call (`eventPayload as NotificationEventPayloadUserEmailChangeSpaceAdmin`, `recipient`); in `getEmailTemplateToUseForEvent` add `case NotificationEvent.UserEmailChangeSpaceAdminNotification.valueOf():` returning `'space.admin.user.email.change'` (the T010 template filename, without the `.js` extension). Depends on T009, T010.
- [X] T013 [US1] Add targeted unit coverage for the new event to `service/src/services/notification/notification.service.spec.ts` — the data-driven `event routing — all NotificationEvent types` suite already exercises routing once T005 + T012 land; add explicit assertions for the new builder method `createEmailTemplatePayloadSpaceAdminUserEmailChange`: the self-initiated `initiatorName` fallback to `subjectProfileSummary.displayName`, the `isSelfInitiated` derivation from `initiatorRole`, the `formatChangeTimestampUTC` rendering of `changedAt`, and that `oldEmail` / `newEmail` pass through in full. Depends on T009–T012.
- [ ] T014 [US1] Validate User Story 1 — with `lib/` built and `0.16.0` resolvable to `service/` (T006), build `service/`, start MailSlurper (`npm run start:services`) and the service (`npm run start:dev`), then run quickstart.md Path A Scenarios 1–3 by publishing `USER_EMAIL_CHANGE_SPACE_ADMIN_NOTIFICATION` messages: Scenario 1 (admin-initiated) → one email per `recipients` entry naming the subject, space, initiator, full old/new addresses and `20 May 2026, 14:32 UTC`, with no "unsupported event" log line (SC-001); Scenario 2 (`initiatorRole: 'self'`, `initiatorProfileSummary` omitted) → the initiator shows the subject's own display name with the self-initiation indicator; Scenario 3 (`triggerOutcome: 'DRIFT_DETECTED'`) → the email reads identically to the `COMMITTED` message (FR-014). End-to-end Path B can now be exercised against the implemented server publisher (plan.md "Dependencies"); Path A remains the quickest isolated check.

**Checkpoint**: User Story 1 is fully functional and independently testable — the complete value of the feature is delivered.

---

## Phase 4: User Story 2 - A space admin opts out of member email-change notifications (Priority: P2)

**Goal**: A space administrator can turn this notification off in the Space group
of their notification settings.

**⚠️ Out of scope for this repository.** Per research.md §R7, the opt-out
preference (FR-009 / FR-010) is satisfied entirely upstream: the **server**
stores the preference and resolves each space's `recipients` with opted-out
admins already excluded; the **client** surfaces the toggle. The notifications
service implements **no** preference logic — it consumes the `recipients` array
as-is. `/speckit.tasks` therefore emits **no implementation tasks** for the
preference in this repo; they are tracked in the sibling server/client specs.
The only repo-side obligation is the negative guarantee verified below.

**Independent Test**: Publish the event for the same space twice, differing only
in whether a given admin address is present in `recipients`, and confirm the
service delivers to exactly the listed addresses and adds nobody.

### Implementation for User Story 2

- [ ] T015 [US2] Verify the consumer-side negative guarantee for FR-009 — with the service running, publish two `USER_EMAIL_CHANGE_SPACE_ADMIN_NOTIFICATION` messages for the same space differing only in `recipients`: one including a given admin address, one omitting it (simulating that admin having opted out server-side). Confirm the service delivers exactly to the addresses in `recipients` and adds nobody — the omitted admin receives nothing while the others still do (SC-004) — and that the empty-`recipients` case (quickstart.md Path A Scenario 4) logs "No recipients" and acks without sending. No code change is expected: the pass-through handler (T011) and `buildAndSendEmailNotifications` already deliver to `recipients` as-is. Depends on T014.

**Checkpoint**: The notifications service provably delivers to exactly the server-resolved recipient set — opted-out admins, filtered out upstream, never receive the email.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Static checks and the no-regression guarantee.

- [X] T016 [P] Run `npm run lint` in `service/` (`tsc --noEmit && eslint`) and `tsc --noEmit` in `lib/`; resolve any type or lint errors introduced by the feature (`lib/` has no `eslint.config.js` — rely on `tsc --noEmit`, per CLAUDE.md "Known Issues").
- [X] T017 [P] Run `npm test` in `service/` and confirm the full Jest suite passes — including the data-driven `event routing — all NotificationEvent types` test now covering `USER_EMAIL_CHANGE_SPACE_ADMIN_NOTIFICATION` — with no regression to existing notification flows (FR-015 / SC-006).
- [ ] T018 Regression check — publish a `SPACE_ADMIN_COMMUNITY_APPLICATION` event and a `USER_EMAIL_CHANGE_GLOBAL_ADMIN_NOTIFICATION` event (quickstart.md "Regression check") and confirm both still render and deliver correctly; the space-community flow and the existing 004 email-change flows MUST be unaffected (FR-015 / SC-006).
- [ ] T019 Full acceptance pass — walk quickstart.md's "Acceptance mapping" table and confirm SC-001 (no "unsupported event" log lines), SC-002 (every listed recipient receives it), SC-003 (a space's admins/leads are notified regardless of the subject's role in that space), SC-005 (non-committed/drift outcomes produce no event — verified by absence), SC-004 (opted-out admins, via T015), FR-011 (blacklist / unsubscribe filtering — quickstart.md Path A Scenario 5: a blacklisted recipient is filtered while other recipients still receive), and SC-006 (no regression). End-to-end Path B can now be run against the implemented server publisher.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependencies — start immediately.
- **Foundational (Phase 2)**: after Setup. **Blocks all user story work.**
- **User Story 1 (Phase 3)**: after Foundational.
- **User Story 2 (Phase 4)**: no implementation in this repo; its single
  verification task (T015) depends on User Story 1 being delivered (T014).
- **Polish (Phase 5)**: after User Story 1 is complete.

### User Story Dependencies

- **US1 (P1)**: after Foundational. Self-contained — the whole feature.
- **US2 (P2)**: out of scope for this repo (research.md §R7). T015 is a
  consumer-side verification only and depends on T014.

### Within User Story 1

- Email-template payload interface (T007) → its `email-template-payload/index.ts`
  export (T008).
- Wire type (T002) + email-template payload (T007) → builder method (T009).
- The Nunjucks template (T010) and the `@EventPattern` handler (T011) are
  independent of the other US1 tasks (different files; T011 needs only the
  Phase 2 enum + wire type).
- Builder method (T009) + template (T010) → the two `notification.service.ts`
  switch cases (T012).
- All US1 implementation (T009–T012) → unit coverage (T013) → validation (T014).

### One file per task — no serialization needed

Every implementation task in this feature edits a distinct file — no two tasks
touch the same file, so each is independently committable:

| File | Task |
|------|------|
| `lib/src/dto/email-change/notification.event.payload.user.email.change.space.admin.ts` (NEW) | T002 |
| `lib/src/dto/index.ts` | T003 |
| `lib/package.json` | T004 |
| `service/src/generated/alkemio-schema.ts` | T005 |
| `service/package.json` | T006 |
| `service/src/services/notification/email-template-payload/space.admin.user.email.change.email.payload.ts` (NEW) | T007 |
| `service/src/services/notification/email-template-payload/index.ts` | T008 |
| `service/src/services/notification/notification.email.payload.builder.service.ts` | T009 |
| `service/src/email-templates/space.admin.user.email.change.js` (NEW) | T010 |
| `service/src/app.controller.ts` | T011 |
| `service/src/services/notification/notification.service.ts` | T012 |
| `service/src/services/notification/notification.service.spec.ts` | T013 |

### Parallel Opportunities

- **Foundational**: T002 ∥ T004 ∥ T005 (three different files, no
  interdependency). Then T003 (after T002), then T006 (after T002, T003, T004).
- **US1**: T007 ∥ T010 ∥ T011 (three different files; each depends only on the
  completed Foundational phase). Then T008 ∥ T009 (after T007). Then T012, T013,
  T014 in sequence.
- **Polish**: T016 ∥ T017.

---

## Parallel Example: User Story 1

```bash
# After Foundational (T002–T006), launch US1's independent file tasks together:
Task: "T007 Create email-template payload in service/src/services/notification/email-template-payload/space.admin.user.email.change.email.payload.ts"
Task: "T010 Create Nunjucks template in service/src/email-templates/space.admin.user.email.change.js"
Task: "T011 Add the @EventPattern handler in service/src/app.controller.ts"

# Then sequence: T008 (after T007) ∥ T009 (after T007)
#                → T012 (after T009, T010) → T013 → T014
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1: Setup (T001).
2. Phase 2: Foundational (T002–T006) — **blocks all user story work**.
3. Phase 3: User Story 1 (T007–T014).
4. **STOP and VALIDATE**: T014 — the space-admin email-change notification works
   end to end via quickstart Path A.
5. Deploy/demo if ready — US1 delivers the whole value of the feature
   (spec.md US1 rationale).

### Incremental Delivery

1. Setup + Foundational → foundation ready.
2. US1 → validate (T014) → deploy/demo — the feature is delivered (MVP).
3. US2 → no implementation in this repo; run the consumer-side verification
   (T015) once US1 is live.
4. Polish (T016–T019) → static checks, regression, and the full acceptance pass.

### Parallel Team Strategy

The feature is small and single-story. One developer carries Foundational → US1
→ Polish. If parallelised, T002 ∥ T004 ∥ T005 in Foundational and
T007 ∥ T010 ∥ T011 in US1 are the only meaningful concurrency.

---

## Notes

- **[P]** = different file, no dependency on an incomplete task.
- **[Story]** label maps each task to a user story for traceability.
- `service/` consumes `@alkemio/notifications-lib` as a versioned dependency, not
  a workspace link — after changing `lib/`, rebuild it and make `0.16.0`
  resolvable to `service/` (`npm pack` + install the tarball, or `npm link`)
  before the service will compile or run (T006).
- Template filename ↔ switch string: `getEmailTemplateToUseForEvent` returns the
  template filename **without** the `.js` extension — file
  `space.admin.user.email.change.js` → returns `'space.admin.user.email.change'`.
- `initiatorRole` wire values are lowercase `'self'` / `'platform_admin'`;
  `triggerOutcome` values are uppercase `'COMMITTED'` / `'DRIFT_DETECTED'`
  (data-model.md §4) — compare against these exact literals. `triggerOutcome` is
  carried on the wire payload for parity with the global-admin event but is
  **not consumed** — there is no drift variant (FR-014, research.md §R9).
- When T005 lands the enum member, the data-driven `event routing — all
  NotificationEvent types` test in `notification.service.spec.ts` immediately
  includes the new event and will **fail** until the switch cases (T012) are in
  place — expected mid-implementation; the suite returns green after T012.
- The new payload extends `NotificationEventPayloadSpace`, so the
  `@EventPattern` handler is a thin pass-through with **no** normalization —
  unlike 004 events 1 & 2, and like 004's global-admin handler (research.md §R4).
- The opt-out preference (FR-009 / FR-010) generates **no tasks** in this repo
  (research.md §R7) — it is server- and client-side work tracked in the sibling
  specs.
- Commit after each task or logical group; stop at the US1 checkpoint to
  validate the feature independently.
