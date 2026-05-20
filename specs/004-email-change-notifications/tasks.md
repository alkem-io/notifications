---
description: "Task list for Email-Change Notification Events"
---

# Tasks: Email-Change Notification Events

**Input**: Design documents from `/specs/004-email-change-notifications/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/events.md, quickstart.md

**Tests**: No automated test tasks are included — the feature specification does
not request unit tests or a TDD approach. Validation is the per-story quickstart
checks (`quickstart.md` Path A) plus a regression pass over the existing Jest
suite (T034).

**Organization**: Tasks are grouped by user story so each story can be
implemented, validated, and delivered as an independent increment.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different file, no dependency on an incomplete task)
- **[Story]**: `[US1]` / `[US2]` / `[US3]` — maps the task to a user story
- Every task names the exact file path it touches

## Path Conventions

Two-package monorepo (plan.md "Project Structure"):

- `lib/` — `@alkemio/notifications-lib` (shared wire payload types)
- `service/` — `alkemio-notifications` NestJS RabbitMQ consumer

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project scaffolding for the feature.

- [X] T001 [P] Create the new directory `lib/src/dto/email-change/` — the home for the three email-change wire payload DTOs added in T005, T015, and T024 (plan.md "Project Structure").
- [X] T002 [P] Establish the no-regression baseline: run `npm run build` in `lib/`, then `npm run build` and `npm test` in `service/`, and confirm all succeed on a clean `004-email-change-notifications` checkout before any changes (baseline evidence for FR-015 / SC-007).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared changes every user story depends on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T003 Add three members to the `NotificationEvent` enum in `service/src/generated/alkemio-schema.ts`: `UserEmailChangeSecuritySignal = 'USER_EMAIL_CHANGE_SECURITY_SIGNAL'`, `UserEmailChangeNewAddressNotification = 'USER_EMAIL_CHANGE_NEW_ADDRESS_NOTIFICATION'`, `UserEmailChangeGlobalAdminNotification = 'USER_EMAIL_CHANGE_GLOBAL_ADMIN_NOTIFICATION'`. Wire values MUST match the publisher exactly (FR-017, research.md §R6). May be regenerated via `npm run codegen` against a spec-097 server, or added manually (values are fixed) — if using codegen, review the diff and keep it scoped to these three members.
- [X] T004 [P] Bump `@alkemio/notifications-lib` from `0.14.2` to `0.15.0` (additive minor bump — research.md §R12, FR-013): set `version` in `lib/package.json` and the `@alkemio/notifications-lib` dependency in `service/package.json`. No existing payload types change.

**Checkpoint**: The shared enum and library version are in place — all three user stories can now begin.

---

## Phase 3: User Story 1 - User is alerted that their login email changed (Priority: P1) 🎯 MVP

**Goal**: The owner of the **previous** mailbox is alerted at the old address
that their login email changed — a security signal carrying the change time,
initiator context, a **masked** new address, and recovery guidance. The full new
address is never present (FR-006).

**Independent Test**: Publish a `USER_EMAIL_CHANGE_SECURITY_SIGNAL` event
(quickstart.md Path A Scenario 1) and confirm exactly one email arrives at the
old address stating the change, showing the UTC change time, the initiator
context, a masked new address, and recovery guidance — with no full new address
and no "unsupported event" log line.

### Implementation for User Story 1

- [X] T005 [P] [US1] Create the wire payload type `NotificationEventPayloadUserEmailChangeSecuritySignal` in `lib/src/dto/email-change/notification.event.payload.user.email.change.security.signal.ts` — fields `recipientEmail: string`, `commitTimestampISO8601: string`, `initiatorRole: 'self' | 'platform_admin'`, `newEmailMasked: string` (data-model.md §1.1). This is a RAW payload — it MUST NOT extend `BaseEventPayload` (research.md §R2).
- [X] T006 [US1] Export the new type from `lib/src/dto/index.ts` (add `export * from './email-change/notification.event.payload.user.email.change.security.signal';`). Depends on T005.
- [X] T007 [P] [US1] Create the email-template payload interface `UserEmailChangeSecuritySignalEmailPayload` extending `BaseEmailPayload` in `service/src/services/notification/email-template-payload/user.email.change.security.signal.email.payload.ts` — fields `changedAt: string`, `initiatorRole: 'self' | 'platform_admin'`, `newEmailMasked: string` (data-model.md §4.1). It MUST NOT carry the full new address (FR-006).
- [X] T008 [US1] Export `UserEmailChangeSecuritySignalEmailPayload` from `service/src/services/notification/email-template-payload/index.ts`. Depends on T007.
- [X] T009 [US1] Add builder method `createEmailTemplatePayloadUserEmailChangeSecuritySignal(eventPayload, recipient)` to `service/src/services/notification/notification.email.payload.builder.service.ts` — format `commitTimestampISO8601` into `changedAt` as UTC with an explicit "UTC" label (e.g. `20 May 2026, 14:32 UTC`, via `toLocaleString('en-GB', { timeZone: 'UTC', ... })` — research.md §R9, FR-018); pass `initiatorRole` and `newEmailMasked` through verbatim; never emit the full new address (FR-006). Depends on T005, T007.
- [X] T010 [P] [US1] Create the Nunjucks email template `service/src/email-templates/user.email.change.security.signal.js` — states the login email was changed, shows `changedAt`, renders the initiator context ("you" when `initiatorRole === 'self'`, otherwise "a platform administrator"), shows `newEmailMasked` verbatim, and includes recovery guidance directing the recipient to support (FR-005). The full new address MUST NOT appear anywhere (FR-006 / SC-004). Follow an existing template such as `service/src/email-templates/platform.admin.user.global.role.change.js` for layout/footer blocks.
- [X] T011 [P] [US1] Add a public raw-payload normalization helper (e.g. `normalizeRawEmailChangeEvent`) to `service/src/services/notification/notification.service.ts`, **shared by US1 and US2** — given a raw events-1/2 payload (structurally typed, keyed on `recipientEmail`) and its `NotificationEvent`, return a `BaseEventPayload`-shaped object: inject `eventType`, inject `platform.url` from config `alkemio.webclient_endpoint` (`ConfigurationTypes.ALKEMIO` — research.md §R7), inject a minimal `triggeredBy` `UserPayload` stub, and synthesize a one-element `recipients` array from `recipientEmail` (`email` set; `id` omitted so `createUserNotificationPreferencesURL` returns `''` — data-model.md §2–3, research.md §R5/R8). Inject `ConfigService` into `NotificationService` if it is not already available.
- [X] T012 [US1] Add the `@EventPattern(NotificationEvent.UserEmailChangeSecuritySignal)` handler `sendUserEmailChangeSecuritySignalNotification` to `service/src/app.controller.ts` — accept the raw `NotificationEventPayloadUserEmailChangeSecuritySignal`, normalize it via the T011 helper, then delegate to `notificationService.processNotificationEvent(...)`. Depends on T003, T005, T011.
- [X] T013 [US1] Add the security-signal cases to the two switch statements in `service/src/services/notification/notification.service.ts`: in `createEmailPayloadForEvent` add `case NotificationEvent.UserEmailChangeSecuritySignal:` returning the T009 builder call (`eventPayload as NotificationEventPayloadUserEmailChangeSecuritySignal`, `recipient`); in `getEmailTemplateToUseForEvent` add `case NotificationEvent.UserEmailChangeSecuritySignal.valueOf():` returning `'user.email.change.security.signal'`. Depends on T009, T010, T011 (same file).
- [ ] T014 [US1] Validate US1 — build `lib/`, make `0.15.0` resolvable to `service/` (`npm pack` + install the tarball, or `npm link`), build `service/`, start MailSlurper (`npm run start:services`) and the service (`npm run start:dev`), then publish a `USER_EMAIL_CHANGE_SECURITY_SIGNAL` message per quickstart.md Path A Scenario 1. Confirm exactly one email at the old address with the masked address, `20 May 2026, 14:32 UTC`, the initiator context, recovery guidance, no full new address, and no "unsupported event" log line (SC-001/SC-002/SC-004); re-run with `initiatorRole: 'self'` and confirm the message says "you".

**Checkpoint**: User Story 1 is fully functional and independently testable — the security-critical MVP.

---

## Phase 4: User Story 2 - New mailbox holder confirms the address is now their login (Priority: P1)

**Goal**: The owner of the **new** mailbox is confirmed at the new address that
this address is now their Alkemio login — showing the full new address, the
change time, the initiator context, a login link, and a recovery/disclaimer line.

**Independent Test**: Publish a `USER_EMAIL_CHANGE_NEW_ADDRESS_NOTIFICATION` event
(quickstart.md Path A Scenario 2) and confirm exactly one email arrives at the
new address confirming the login email, showing the full new address, the UTC
change time, the initiator context, and a working login link.

### Implementation for User Story 2

- [X] T015 [P] [US2] Create the wire payload type `NotificationEventPayloadUserEmailChangeNewAddress` in `lib/src/dto/email-change/notification.event.payload.user.email.change.new.address.ts` — fields `recipientEmail: string`, `commitTimestampISO8601: string`, `initiatorRole: 'self' | 'platform_admin'`, `newEmailFull: string`, `loginUrl: string` (data-model.md §1.2). RAW payload — it MUST NOT extend `BaseEventPayload`.
- [X] T016 [US2] Export the new type from `lib/src/dto/index.ts`. Depends on T015.
- [X] T017 [P] [US2] Create the email-template payload interface `UserEmailChangeNewAddressEmailPayload` extending `BaseEmailPayload` in `service/src/services/notification/email-template-payload/user.email.change.new.address.email.payload.ts` — fields `changedAt: string`, `initiatorRole: 'self' | 'platform_admin'`, `newEmailFull: string`, `loginUrl: string` (data-model.md §4.2).
- [X] T018 [US2] Export `UserEmailChangeNewAddressEmailPayload` from `service/src/services/notification/email-template-payload/index.ts`. Depends on T017.
- [X] T019 [US2] Add builder method `createEmailTemplatePayloadUserEmailChangeNewAddress(eventPayload, recipient)` to `service/src/services/notification/notification.email.payload.builder.service.ts` — format `commitTimestampISO8601` into `changedAt` as UTC with the explicit "UTC" label (research.md §R9, FR-018); pass `initiatorRole`, `newEmailFull`, and `loginUrl` through verbatim. Depends on T015, T017.
- [X] T020 [P] [US2] Create the Nunjucks email template `service/src/email-templates/user.email.change.new.address.js` — states this address is now the account's Alkemio login email, shows `newEmailFull`, `changedAt`, the initiator context ("you" vs "a platform administrator"), a login link to `loginUrl`, and a recovery/disclaimer line (FR-008).
- [X] T021 [US2] Add the `@EventPattern(NotificationEvent.UserEmailChangeNewAddressNotification)` handler `sendUserEmailChangeNewAddressNotification` to `service/src/app.controller.ts` — accept the raw `NotificationEventPayloadUserEmailChangeNewAddress`, normalize it via the T011 helper, then delegate to `notificationService.processNotificationEvent(...)`. Depends on T003, T011, T015.
- [X] T022 [US2] Add the new-address cases to the two switch statements in `service/src/services/notification/notification.service.ts`: in `createEmailPayloadForEvent` add `case NotificationEvent.UserEmailChangeNewAddressNotification:` returning the T019 builder call; in `getEmailTemplateToUseForEvent` add `case NotificationEvent.UserEmailChangeNewAddressNotification.valueOf():` returning `'user.email.change.new.address'`. Depends on T019, T020.
- [ ] T023 [US2] Validate US2 — with the service running, publish a `USER_EMAIL_CHANGE_NEW_ADDRESS_NOTIFICATION` message per quickstart.md Path A Scenario 2. Confirm exactly one email at the new address confirming the login email, showing the full new address, `changedAt`, the initiator context, a working login link, and a recovery/disclaimer line (SC-002), and no "unsupported event" log line (SC-001).

**Checkpoint**: User Stories 1 and 2 both work independently — the full minimum viable user-facing outcome of an email change is delivered.

---

## Phase 5: User Story 3 - Platform administrators are informed of the email change (Priority: P2)

**Goal**: Platform global administrators receive an informational message naming
the affected user and the initiator, showing the full old and new addresses and
the change time — with a distinct reconciliation-required variant for
drift-detected outcomes.

**Independent Test**: Publish a `USER_EMAIL_CHANGE_GLOBAL_ADMIN_NOTIFICATION`
event (quickstart.md Path A Scenario 3) and confirm one email per `recipients`
entry showing the subject and initiator display names, the full old and new
emails, and the change time; re-run with `triggerOutcome: DRIFT_DETECTED` and
confirm the reconciliation-required variant renders.

### Implementation for User Story 3

- [X] T024 [P] [US3] Create the wire payload type `NotificationEventPayloadUserEmailChangeGlobalAdmin` **extending `BaseEventPayload`** in `lib/src/dto/email-change/notification.event.payload.user.email.change.global.admin.ts` — event-specific fields `subjectProfileSummary: { id: string; displayName: string }`, `oldEmail: string`, `newEmail: string`, `initiatorProfileSummary?: { id: string; displayName: string }`, `initiatorRole: 'self' | 'platform_admin'`, `commitTimestampISO8601: string`, `triggerOutcome: 'COMMITTED' | 'DRIFT_DETECTED'`, optional `subjectMemberships` and `subjectGlobalRoles` (data-model.md §1.3). It carries the full `BaseEventPayload` envelope — `eventType`, `triggeredBy`, `recipients`, `platform` (research.md §R2).
- [X] T025 [US3] Export the new type from `lib/src/dto/index.ts`. Depends on T024.
- [X] T026 [P] [US3] Create the email-template payload interface `PlatformAdminUserEmailChangeEmailPayload` extending `BaseEmailPayload` in `service/src/services/notification/email-template-payload/platform.admin.user.email.change.email.payload.ts` — fields `subjectName: string`, `initiatorName: string`, `isSelfInitiated: boolean`, `oldEmail: string`, `newEmail: string`, `changedAt: string`, `triggerOutcome: 'COMMITTED' | 'DRIFT_DETECTED'` (data-model.md §4.3).
- [X] T027 [US3] Export `PlatformAdminUserEmailChangeEmailPayload` from `service/src/services/notification/email-template-payload/index.ts`. Depends on T026.
- [X] T028 [US3] Add builder method `createEmailTemplatePayloadPlatformAdminUserEmailChange(eventPayload, recipient)` to `service/src/services/notification/notification.email.payload.builder.service.ts` — set `subjectName` from `subjectProfileSummary.displayName`, `initiatorName` from `initiatorProfileSummary?.displayName ?? subjectProfileSummary.displayName` (FR-019 fallback), `isSelfInitiated` from `initiatorRole === 'self'`; format `changedAt` as UTC with the "UTC" label (research.md §R9); pass `oldEmail`, `newEmail`, and `triggerOutcome` through verbatim. Depends on T024, T026.
- [X] T029 [P] [US3] Create the Nunjucks email template `service/src/email-templates/platform.admin.user.email.change.js` — shows `subjectName`, `initiatorName`, the full `oldEmail` and `newEmail`, and `changedAt`; branches on `triggerOutcome` — `COMMITTED` → routine confirmation, `DRIFT_DETECTED` → reconciliation-required action item (FR-011, research.md §R11); when `isSelfInitiated` is true, render the explicit self-initiation indicator (FR-019).
- [X] T030 [US3] Add the `@EventPattern(NotificationEvent.UserEmailChangeGlobalAdminNotification)` handler `sendUserEmailChangeGlobalAdminNotification` to `service/src/app.controller.ts` — a thin pass-through that delegates the `NotificationEventPayloadUserEmailChangeGlobalAdmin` payload straight to `notificationService.processNotificationEvent(...)` with NO normalization (the payload is already a `BaseEventPayload` with a server-resolved `recipients` array), mirroring the existing `sendPlatformGlobalRoleChangeNotification`. Depends on T003, T024.
- [X] T031 [US3] Add the global-admin cases to the two switch statements in `service/src/services/notification/notification.service.ts`: in `createEmailPayloadForEvent` add `case NotificationEvent.UserEmailChangeGlobalAdminNotification:` returning the T028 builder call; in `getEmailTemplateToUseForEvent` add `case NotificationEvent.UserEmailChangeGlobalAdminNotification.valueOf():` returning `'platform.admin.user.email.change'`. Depends on T028, T029.
- [ ] T032 [US3] Validate US3 — with the service running, publish a `USER_EMAIL_CHANGE_GLOBAL_ADMIN_NOTIFICATION` message per quickstart.md Path A Scenario 3. Confirm one email per `recipients` entry showing the subject and initiator display names, the full old and new emails, and `changedAt` (SC-002 wording / FR-010); re-run with `triggerOutcome: 'DRIFT_DETECTED'` (reconciliation-required variant — SC-005) and with `initiatorRole: 'self'` + `initiatorProfileSummary` omitted (initiator falls back to the subject's display name with the self-initiation indicator — FR-019). End-to-end Path B is blocked on the server follow-up (research.md §R13) — validate via Path A.

**Checkpoint**: All three user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verification across stories and the regression guarantee.

- [X] T033 [P] Run `npm run lint` in `service/` (`tsc --noEmit && eslint`) and `tsc --noEmit` in `lib/`; resolve any type or lint errors introduced by the feature. (`lib/` lint has no `eslint.config.js` — rely on `tsc --noEmit`, per CLAUDE.md "Known Issues".)
- [X] T034 [P] Run `npm test` in `service/` and confirm the existing Jest suite still passes — no regression to existing notification flows (FR-015 / SC-007).
- [ ] T035 Regression check — publish a `PLATFORM_ADMIN_GLOBAL_ROLE_CHANGED` event (quickstart.md "Regression check") and confirm it still renders and delivers correctly; the global-role-change flow MUST be unaffected (FR-015 / SC-007).
- [ ] T036 Full acceptance pass — run quickstart.md Path A Scenarios 1–3 and walk the "Acceptance mapping" table, confirming SC-001 through SC-007 (event-3 end-to-end Path B remains blocked on the server follow-up — research.md §R13).
- [ ] T037 Verify FR-012 — blacklist / unsubscribe filtering. Add a test recipient address to the blacklist (via the mechanism `NotificationBlacklistService` uses — GraphQL-synced or static), then publish a `USER_EMAIL_CHANGE_SECURITY_SIGNAL` (quickstart.md Path A Scenario 1) with that address as `recipientEmail`, and a `USER_EMAIL_CHANGE_GLOBAL_ADMIN_NOTIFICATION` (Scenario 3) with that address in `recipients[]`; confirm no email is delivered to the blacklisted address in either case. Exercises both the synthesized single-recipient path (events 1 & 2 share it) and the server-resolved `recipients[]` path (event 3) — FR-012, research.md §R14.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependencies — start immediately.
- **Foundational (Phase 2)**: after Setup. **Blocks all user stories.**
- **User Stories (Phase 3–5)**: each depends on Foundational. US1 and US3 are
  mutually independent; US2 reuses the normalization helper created in US1
  (T011).
- **Polish (Phase 6)**: after all targeted user stories are complete.

### User Story Dependencies

- **US1 (P1)**: after Foundational. Self-contained. Creates the shared
  normalization helper (T011).
- **US2 (P1)**: after Foundational. Reuses US1's T011 helper. *If US2 is built
  before US1*, create the T011 normalization helper as part of US2 instead — it
  is the only cross-story coupling.
- **US3 (P2)**: after Foundational. Fully independent — no normalization
  (pass-through handler).

### Within Each User Story

- Wire payload type → its `lib/src/dto/index.ts` export.
- Email-template payload interface → its `email-template-payload/index.ts` export.
- Wire type + email-template payload → builder method.
- Nunjucks template is independent of the TypeScript tasks.
- Builder method + template → the two `notification.service.ts` switch cases.
- Enum (T003) + wire type + normalization helper → the `@EventPattern` handler.
- All implementation tasks → the story's validation task.

### Shared files — serialize edits

These five files are touched by more than one story. The additions are
semantically non-conflicting (distinct enum cases, methods, handlers, export
lines), but the edits land in the same file and must be merged/serialized:

- `lib/src/dto/index.ts` — T006, T016, T025
- `service/src/services/notification/email-template-payload/index.ts` — T008, T018, T027
- `service/src/services/notification/notification.email.payload.builder.service.ts` — T009, T019, T028
- `service/src/services/notification/notification.service.ts` — T011, T013, T022, T031
- `service/src/app.controller.ts` — T012, T021, T030

### Parallel Opportunities

- **Setup**: T001 ∥ T002.
- **Foundational**: T003 ∥ T004.
- **US1**: T005 ∥ T007 ∥ T010 ∥ T011 (four different files, no interdependency).
- **US2**: T015 ∥ T017 ∥ T020.
- **US3**: T024 ∥ T026 ∥ T029.
- **Polish**: T033 ∥ T034.
- **Cross-story**: after Foundational, US1 / US2 / US3 can be developed in
  parallel by different developers — provided the five shared files above are
  merged carefully.

---

## Parallel Example: User Story 1

```bash
# After Foundational (T003, T004), launch US1's independent file-creation tasks together:
Task: "T005 Create wire payload type in lib/src/dto/email-change/notification.event.payload.user.email.change.security.signal.ts"
Task: "T007 Create email-template payload in service/src/services/notification/email-template-payload/user.email.change.security.signal.email.payload.ts"
Task: "T010 Create Nunjucks template in service/src/email-templates/user.email.change.security.signal.js"
Task: "T011 Add the raw-payload normalization helper in service/src/services/notification/notification.service.ts"

# Then sequence: T006 (after T005) → T008 (after T007) → T009 (after T005,T007)
#                → T013 (after T009,T010,T011) ; T012 (after T003,T005,T011) → T014
```

## Parallel Example: User Story 3

```bash
# US3 has no normalization step — three independent new files start together:
Task: "T024 Create wire payload type in lib/src/dto/email-change/notification.event.payload.user.email.change.global.admin.ts"
Task: "T026 Create email-template payload in service/src/services/notification/email-template-payload/platform.admin.user.email.change.email.payload.ts"
Task: "T029 Create Nunjucks template in service/src/email-templates/platform.admin.user.email.change.js"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1: Setup (T001–T002).
2. Phase 2: Foundational (T003–T004) — **blocks all stories**.
3. Phase 3: User Story 1 (T005–T014).
4. **STOP and VALIDATE**: T014 — the security-critical signal works on its own.
5. Deploy/demo if ready — US1 delivers value alone (spec.md US1 rationale).

### Incremental Delivery

1. Setup + Foundational → foundation ready.
2. US1 → validate (T014) → deploy/demo — security signal (MVP).
3. US2 → validate (T023) → deploy/demo — completes the **minimum viable
   user-facing outcome** (US1 + US2, both P1).
4. US3 → validate (T032) → deploy/demo — admin operational awareness (P2).
5. Polish (T033–T037) → regression + full acceptance pass.

Each story is an independently shippable increment that does not break the
previous ones.

### Parallel Team Strategy

After Foundational, three developers can take US1, US2, US3 concurrently.
Coordinate merges of the five shared files (see "Shared files — serialize
edits"), and have whoever finishes US1 first land the T011 normalization helper,
since US2 depends on it.

---

## Notes

- **[P]** = different file, no dependency on an incomplete task.
- **[Story]** label maps each task to a user story for traceability.
- `service/` consumes `@alkemio/notifications-lib` as a versioned dependency, not
  a workspace link — after changing `lib/`, rebuild it and make `0.15.0`
  resolvable to `service/` (`npm pack` + install the tarball, or `npm link`)
  before the service will compile or run.
- Template filename ↔ switch string: `getEmailTemplateToUseForEvent` returns the
  template filename **without** the `.js` extension (e.g. file
  `user.email.change.security.signal.js` → returns `'user.email.change.security.signal'`).
- `initiatorRole` wire values are lowercase `'self'` / `'platform_admin'`;
  `triggerOutcome` values are uppercase `'COMMITTED'` / `'DRIFT_DETECTED'`
  (research.md §R3/§R4) — compare against these exact literals.
- No automated test tasks: the spec does not request unit tests. Validation is
  the quickstart Path A checks (T014, T023, T032) plus the existing-suite
  regression run (T034).
- Commit after each task or logical group; stop at any checkpoint to validate a
  story independently.
