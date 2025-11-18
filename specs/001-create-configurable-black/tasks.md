# Tasks: Configurable Email Blacklist for Notifications

## Phase 1 – Setup & Constitution Alignment

- [ ] T001 Ensure `service/` and `lib/` dependencies installed (`npm install` in `service/` and `lib/`)
- [ ] T002 Verify existing build and test commands for `service/` (`npm run build`, `npm test` from `service/`)
- [ ] T003 Confirm no DTO changes are required for v1 by reviewing `lib/src/dto/**` against spec requirements
- [ ] T004 Document constitution alignment in `specs/001-create-configurable-black/plan.md` (update if implementation deviates)

## Phase 2 – Foundational Infrastructure

- [ ] T005 Add blacklist configuration option to `service/src/config/configuration.ts` (e.g., array of exact email addresses)
- [ ] T006 [P] Thread blacklist configuration through `service/src/config/index.ts` and any related config helpers
- [ ] T007 [P] Add typed configuration property for blacklist to `service/src/config/aliases.ts` or relevant config typings
- [ ] T008 Add basic unit tests (if present) for configuration loading to ensure blacklist config is read correctly in `service/test/**`

## Phase 3 – User Story 1 (US1): Prevent emails to blacklisted addresses

**Goal**: Ensure notifications are never sent to blacklisted email addresses while non-blacklisted recipients continue to receive emails.

**Independent Test Criteria**: Trigger notifications to at least one blacklisted and one non-blacklisted recipient and verify that only non-blacklisted recipients receive emails.

- [ ] T009 [US1] Identify the central notification sending path in `service/src/services/notification/notification.service.ts` (where recipient lists are finalized before sending)
- [ ] T010 [P] [US1] Create a dedicated blacklist helper/service (e.g., `service/src/services/notification/notification.blacklist.service.ts`) that exposes a function to filter recipients based on configured blacklist
- [ ] T011 [P] [US1] Implement recipient filtering in `notification.blacklist.service.ts` using exact email address matching only
- [ ] T012 [US1] Inject and wire the blacklist helper/service into `notification.service.ts`, ensuring the blacklist filter runs after recipient resolution and before sending
- [ ] T013 [US1] Handle edge case where all recipients are blacklisted in `notification.service.ts` (no send is attempted, but flow is treated as successfully processed with appropriate logging)
- [ ] T014 [P] [US1] Add unit tests in `service/test/**` to cover: single blacklisted recipient, mixed (blacklisted + allowed), and no blacklisted recipients
- [ ] T015 [US1] [Constitution E2E] Add an end-to-end style test or integration-style test (if feasible in `service/test/**`) that simulates a notification with mixed recipients and asserts that only allowed recipients are sent to the email transport layer, satisfying the constitution's end-to-end validation requirement.

## Phase 4 – User Story 2 (US2): Configure and manage the blacklist

**Goal**: Allow operations to configure and update the blacklist via existing configuration mechanisms without code changes.

**Independent Test Criteria**: Start the service with an initial blacklist, change the configuration (e.g., add/remove email), restart/reload as documented, and observe updated behavior.

- [ ] T016 [US2] Decide and document the configuration mechanism for the blacklist (e.g., environment variable, YAML config) in `specs/001-create-configurable-black/quickstart.md`
- [ ] T017 [US2] Implement configuration parsing for the blacklist in `service/src/config/configuration.ts` (including empty/missing config handling)
- [ ] T018 [P] [US2] Implement validation of configured blacklist entries (ignore invalid email formats with a warning) in `service/src/config/configuration.ts` or the blacklist helper
- [ ] T019 [US2] Ensure configuration reload behavior is documented (restart vs hot-reload) in `specs/001-create-configurable-black/quickstart.md`
- [ ] T020 [P] [US2] Add tests in `service/test/**` verifying that different blacklist configurations (empty, single address, multiple addresses) are correctly surfaced into the blacklist helper/service

- [ ] T020a [US2] Extend configuration tests to cover duplicate blacklist entries (same email repeated) and assert that behavior is equivalent to a single entry (no errors, recipient still blocked).
- [ ] T020b [US2] Add a test or documented note covering behavior of notifications across service restarts (for example, ensure that config changes only affect notifications processed after restart, and capture this explicitly in test descriptions or docs).

## Phase 5 – User Story 3 (US3): Observe and audit blacklist behavior

**Goal**: Provide clear logs/metrics to observe when notifications are blocked due to the blacklist.

**Independent Test Criteria**: Trigger notifications to blacklisted and non-blacklisted addresses and verify distinct, structured logging/metrics for blacklist blocks.

- [ ] T021 [US3] Define the logging format for blacklist blocks (fields such as recipient email, reason, notification type) and document it in `specs/001-create-configurable-black/research.md` or `quickstart.md`
- [ ] T022 [US3] Implement logging in `notification.blacklist.service.ts` or `notification.service.ts` when recipients are filtered due to blacklist
- [ ] T023 [P] [US3] If metrics/monitoring integration exists, increment or emit a metric for blacklist blocks in the appropriate location in `service/src/**`
- [ ] T024 [P] [US3] Add tests in `service/test/**` to assert that logs/metrics are produced when a recipient is blocked by the blacklist (using existing logging test patterns)

## Phase 6 – Polish & Cross-Cutting Concerns

- [ ] T025 Update `service/README.md` to briefly describe the blacklist feature and how to configure it
- [ ] T026 Add operational guidance and example scenarios to `specs/001-create-configurable-black/quickstart.md` (e.g., sample config, how to verify behavior with mailslurper)
- [ ] T027 Run full `service` validation: `npm run build`, `npm test`, `npm run lint` from `service/`
- [ ] T028 [P] Validate `lib` still builds successfully (`npm run build` from `lib/`)
- [ ] T029 Review `specs/001-create-configurable-black/spec.md`, `plan.md`, and this `tasks.md` for consistency and update any drift before opening PR

## Dependencies & Story Order

- US1 depends on Phase 2 foundational configuration wiring.
- US2 depends on core blacklist enforcement existing (US1) so that configuration changes have observable effects.
- US3 depends on US1 (enforcement) and partially on US2 (configuration) to produce meaningful logs/metrics.

Recommended implementation order: Phase 1 → Phase 2 → US1 (Phase 3) → US2 (Phase 4) → US3 (Phase 5) → Phase 6.

## Parallel Execution Examples

- T006, T007, and T008 can be implemented in parallel once T005 is defined.
- T010, T011, and T014 can be worked on in parallel after T009 identifies the central notification path.
- T018 and T020 can run in parallel after T017 is in place.
- T023 and T024 can be implemented in parallel once T022 defines where blacklist blocks are logged/emitted.
- T027 and T028 can run in parallel at the end of implementation.
