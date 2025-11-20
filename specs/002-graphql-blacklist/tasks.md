# Tasks: GraphQL-Sourced Notification Email Blacklist

## Overview

- **Feature**: GraphQL-Sourced Notification Email Blacklist
- **Branch**: `002-graphql-blacklist`
- **Spec**: `specs/002-graphql-blacklist/spec.md`
- **Plan**: `specs/002-graphql-blacklist/plan.md`

This tasks file is organized by phase and user story. Each task is independently actionable, with story phases designed to be independently testable. Tests are included where explicitly required by the spec (FR-005).

---

## Phase 1 – Setup & Repository Preparation

- [ ] T001 Ensure service dependencies are installed in `service/` via `npm install`
- [ ] T002 Ensure library dependencies are installed in `lib/` via `npm install`
- [ ] T003 Verify current notification blacklist usage in `service/src/config/notifications.yml` (or equivalent) and `service/src/services/notification/**` for impact analysis

---

## Phase 2 – Foundational Infrastructure (Pre-requisite for User Story 1)

- [ ] T004 [P] Add configuration flags and interval setting for GraphQL blacklist sync in `service/src/config/configuration.ts`
- [ ] T005 [P] Wire new configuration options into the typed config surface in `service/src/config/index.ts`
- [ ] T006 [P] Document new configuration keys (endpoint override, enable flag, interval) in `service/README.md`
- [ ] T007 Implement or reuse a lightweight GraphQL client helper (including auth via existing machine token) in `service/src/core` or `service/src/config` as per existing patterns
- [ ] T008 Add environment variable plumbing (if needed) for GraphQL endpoint and token in `service/notifications.yml` or Helm manifests under `service/manifests/25-notifications-deployment-dev.yaml`

---

## Phase 3 – User Story 1 (P1): Platform Admin Blacklist Updates Propagate Automatically

**Goal**: Platform administrators manage `notificationEmailBlacklist` via GraphQL mutations and see changes applied automatically in notification delivery within the configured refresh window.

### US1 – Implementation Tasks

- [ ] T009 [US1] Define internal TypeScript type for `NotificationEmailBlacklistSnapshot` in `service/src/types/blacklist.types.ts`
- [ ] T010 [US1] Implement `BlacklistSyncService` (or similar) in `service/src/services/notification/blacklist-sync.service.ts` to fetch `platform.settings.integration.notificationEmailBlacklist` via GraphQL
- [ ] T011 [US1] In `BlacklistSyncService`, implement startup sync behavior: on bootstrap, fetch initial snapshot and default to empty blacklist on failure with error logging
- [ ] T012 [US1] Implement periodic refresh with configurable interval and exponential backoff on failures in `BlacklistSyncService`
- [ ] T013 [US1] Implement normalization logic (trim, lowercase, deduplicate, simple email validation, limit handling) inside `BlacklistSyncService`
- [ ] T014 [US1] Expose a thread-safe method on `BlacklistSyncService` to retrieve the current snapshot for use during notification sends
- [ ] T015 [US1] Register `BlacklistSyncService` in the appropriate NestJS module (e.g., `service/src/services/notification/notification.module.ts` or `app.module.ts`) and ensure it starts its sync loop on application bootstrap
- [ ] T016 [US1] Integrate blacklist enforcement into existing recipient filtering path in `service/src/services/notification/notification.service.ts` (or equivalent), skipping emails whose addresses are present in the snapshot
- [ ] T017 [US1] Add structured logging for blacklist sync attempts (success/failure, snapshot size, fetchedAt) in `BlacklistSyncService`
- [ ] T018 [US1] Add structured logging for per-recipient blacklist decisions (blacklisted vs not) in `notification.service.ts` using existing logging patterns
- [ ] T019 [US1] Add configuration-based toggle so environments without GraphQL can disable sync and optionally fall back to static blacklist in `notifications.yml`
- [ ] T020 [US1] Update any existing static blacklist handling to ensure clear precedence when GraphQL sync is enabled vs disabled in `service/src/config/notifications.yml` and related code

### US1 – Tests & Validation

- [ ] T021 [P] [US1] Add unit tests for `BlacklistSyncService` happy-path sync behavior using a mocked GraphQL client in `service/src/services/notification/blacklist-sync.service.spec.ts`
- [ ] T022 [P] [US1] Add unit tests for normalization, limit handling, and invalid email filtering in `service/src/services/notification/blacklist-sync.service.spec.ts`
- [ ] T023 [P] [US1] Add unit tests for failure scenarios (network error, non-2xx, 401) ensuring last-good snapshot retention and exponential backoff in `service/src/services/notification/blacklist-sync.service.spec.ts`
- [ ] T024 [US1] Update or add test fixtures/mocks for GraphQL responses in `service/test/mocks/graphql/blacklist.response.ts` (or similar path under `service/test/mocks`)
- [ ] T025 [US1] Validate the quickstart steps in `specs/002-graphql-blacklist/quickstart.md` against a running dev environment and adjust documentation if discrepancies are found

---

## Phase 4 – Polish & Cross-Cutting Concerns (Post-MVP Enhancements)

- [ ] T028 [P] Review logging fields for blacklist-related events to ensure they can support future DR-001/DR-002 observability requirements in `service/src/services/notification/blacklist-sync.service.ts` and `notification.service.ts`
- [ ] T029 [P] Add notes or TODOs referencing future metrics (`notifications_blacklist_snapshot_age_seconds`, `notifications_blacklist_sync_failures_total`) where they would be instrumented later
- [ ] T030 Run `npm run build`, `npm test`, and `npm run lint` in `service/` and capture results in the PR description
- [ ] T031 Optionally run `npm run build` in `lib/` to ensure DTO compilation remains healthy

---

## Dependencies & Story Order

- **Story Order**:
  - User Story 1 (P1) is the only MVP story and is implemented in Phase 3.

- **Phase Dependencies**:
  - Phase 1 (Setup) → Phase 2 (Foundational) → Phase 3 (US1) → Phase 4 (Polish).
  - Tasks T004–T008 in Phase 2 must be completed before wiring and testing `BlacklistSyncService` in Phase 3.

---

## Parallel Execution Opportunities

- Configuration and documentation tasks (T004–T006, T008) can run in parallel with client helper implementation (T007).
- Within US1, the core service implementation (T009–T020) can proceed in parallel with test scaffolding and mock setup (T021–T024, T026) as long as interfaces are agreed.
- Validation and quickstart verification (T027) should run after the main implementation and tests are in place.

---

## Implementation Strategy (MVP First)

1. Complete Phase 1–2 to prepare configuration and infrastructure for GraphQL access.
2. Implement `BlacklistSyncService` and integrate blacklist enforcement into notification sending (T009–T020).
3. Add and stabilize tests for sync behavior and recipient filtering (T021–T026), ensuring FR-005 coverage.
4. Validate the end-to-end flow using the quickstart guide (T027).
5. Apply polish and cross-cutting improvements (Phase 4) as time allows.
