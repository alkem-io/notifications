# Tasks: Remove Registration Successful Notification

**Input**: Design documents from `/specs/003-remove-registration-notification/`
**Prerequisites**: plan.md (tech stack, structure), spec.md (user stories), research.md (decisions)

**Tests**: No tests explicitly requested in the feature specification. Manual testing will be performed per research.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and verification.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **service/**: NestJS microservice with notification handlers
- **lib/**: TypeScript library with shared DTOs
- **specs/**: Feature specification documents

---

## Phase 1: Setup (Preparation)

**Purpose**: Ensure codebase understanding and prepare for changes

- [x] T001 Verify current notification flow by reviewing `service/src/services/notification/notification.service.ts`
- [x] T002 [P] Document current email template content from `service/src/email-templates/user.sign.up.welcome.js`
- [x] T003 [P] Document admin template content from `service/src/email-templates/platform.admin.user.profile.created.js`

---

## Phase 2: Foundational

**Purpose**: Verify existing error handling behavior

- [x] T004 ~~Modify default case~~ - SKIPPED (keeping original fail-early behavior with `EventPayloadNotProvidedException`)
- [x] T005 ~~Modify default case~~ - SKIPPED (keeping original fail-early behavior)
- [x] T006 ~~Create no-op payload~~ - SKIPPED (keeping original fail-early behavior)

**Note**: Original fail-early behavior preserved. Unknown events will throw `EventPayloadNotProvidedException` as before.

---

## Phase 3: User Story 1 - New User Registration Experience (Priority: P1)

**Goal**: Remove registration notification so users don't receive premature "Registration successful!" emails

**Independent Test**: Complete a new user registration flow and verify no "Registration successful!" notification is sent from the notifications service. Verify other notifications still work.

### Implementation for User Story 1

**Note**: Only `USER_SIGN_UP_WELCOME` is removed. `PLATFORM_ADMIN_USER_PROFILE_CREATED` (admin notification) remains unchanged.

- [x] T007 [US1] Remove `NotificationEventType.USER_SIGN_UP_WELCOME` case from `createEmailPayloadForEvent()` switch in `service/src/services/notification/notification.service.ts`
- [x] T008 [US1] ~~Remove PLATFORM_ADMIN_USER_PROFILE_CREATED~~ - SKIPPED (admin notification kept)
- [x] T009 [US1] Remove `NotificationEventType.USER_SIGN_UP_WELCOME` case from `getEmailTemplateToUseForEvent()` switch in `service/src/services/notification/notification.service.ts`
- [x] T010 [US1] ~~Remove PLATFORM_ADMIN_USER_PROFILE_CREATED template case~~ - SKIPPED (admin notification kept)
- [x] T011 [P] [US1] Remove `createEmailTemplatePayloadUserSignUpWelcome()` method from `service/src/services/notification/notification.email.payload.builder.service.ts`
- [x] T012 [P] [US1] ~~Remove buildPlatformAdminUserProfileCreatedEmailPayload~~ - SKIPPED (admin notification kept)
- [x] T013 [US1] ~~Remove PlatformUserRegisteredEmailPayload import~~ - SKIPPED (still used by admin notification)
- [x] T014 [P] [US1] Delete email template file `service/src/email-templates/user.sign.up.welcome.js`
- [x] T015 [P] [US1] ~~Delete platform.admin.user.profile.created.js~~ - SKIPPED (admin notification kept)
- [x] T016 [US1] ~~Delete PlatformUserRegisteredEmailPayload type~~ - SKIPPED (still used by admin notification)
- [x] T017 [US1] ~~Remove PlatformUserRegisteredEmailPayload export~~ - SKIPPED (still used by admin notification)
- [x] T018 [US1] Run linting to verify no unused imports remain: `cd service && npm run lint`
- [x] T019 [US1] Run build to verify TypeScript compiles: `cd service && npm run build`

**Checkpoint**: Registration notification completely removed. Manual test: publish registration event to RabbitMQ at http://localhost:15672, verify no email sent and no error logged.

---

## Phase 4: User Story 2 - Infrastructure Template Updates (Priority: P1)

**Goal**: Ensure cross-repo specification document is complete for infrastructure teams

**Independent Test**: Infrastructure team can review `cross-repo-spec.md` and confirm it contains all information needed to update Kratos templates.

### Implementation for User Story 2

- [x] T020 [US2] Verify `specs/003-remove-registration-notification/cross-repo-spec.md` contains exact email content from templates
- [x] T021 [US2] Verify `specs/003-remove-registration-notification/cross-repo-spec.md` includes template variable mappings
- [x] T022 [US2] Verify `specs/003-remove-registration-notification/cross-repo-spec.md` includes verification checklist
- [x] T023 [US2] Add any missing content or clarifications to `specs/003-remove-registration-notification/cross-repo-spec.md` based on actual template files

**Checkpoint**: Cross-repo specification is complete and ready for infrastructure team use

---

## Phase 5: User Story 3 - Cross-Repository Implementation Spec (Priority: P2)

**Goal**: Ensure specification document is ready for infrastructure-operations and dev-orchestration repositories

**Independent Test**: Infrastructure team confirms the spec document is self-contained and actionable.

### Implementation for User Story 3

- [x] T024 [US3] Review `specs/003-remove-registration-notification/cross-repo-spec.md` for completeness against spec.md requirements
- [x] T025 [US3] Verify deployment order section is accurate in `specs/003-remove-registration-notification/cross-repo-spec.md`
- [x] T026 [US3] Verify rollback plan is documented in `specs/003-remove-registration-notification/cross-repo-spec.md`
- [x] T027 [US3] Commit the cross-repo-spec.md as the output document for infrastructure teams

**Checkpoint**: Specification document ready for handoff to infrastructure-operations and dev-orchestration teams

---

## Phase 6: Polish & Verification

**Purpose**: Final verification and cleanup

- [x] T028 Run full test suite to verify no regressions: `cd service && npm test`
- [ ] T029 Manual verification: Start local services with `npm run start:services`, publish test registration event, verify silent handling
- [ ] T030 Verify other notification types still work (send a different notification event type)
- [x] T031 Update CLAUDE.md if any project structure notes need adjustment

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - can start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 - BLOCKS all user story work
- **Phase 3 (US1)**: Depends on Phase 2 completion - core removal work
- **Phase 4 (US2)**: Can start after Phase 1 (parallel with Phase 2/3 if desired)
- **Phase 5 (US3)**: Can start after Phase 4
- **Phase 6 (Polish)**: Depends on Phase 3 completion

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational phase (Phase 2) - blocks US2/US3 testing
- **User Story 2 (P1)**: Independent - only requires Phase 1 for content extraction
- **User Story 3 (P2)**: Depends on US2 - refinement of the cross-repo spec

### Within Each Phase

- Tasks marked [P] can run in parallel
- Remove case statements (T007-T010) before removing methods (T011-T012)
- Delete files (T014-T016) after removing code references
- Lint/build (T018-T019) after all code changes

### Parallel Opportunities

- T002 and T003 (documenting templates) can run in parallel
- T011 and T012 (removing builder methods) can run in parallel
- T014 and T015 (deleting template files) can run in parallel
- US2 tasks can run in parallel with US1 implementation

---

## Parallel Example: User Story 1 Template Cleanup

```bash
# Launch template deletions in parallel:
Task: "Delete email template file service/src/email-templates/user.sign.up.welcome.js"
Task: "Delete email template file service/src/email-templates/platform.admin.user.profile.created.js"

# Launch builder method removals in parallel:
Task: "Remove buildUserSignUpWelcomeEmailPayload() method"
Task: "Remove buildPlatformAdminUserProfileCreatedEmailPayload() method"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (understand current code)
2. Complete Phase 2: Foundational (graceful event handling)
3. Complete Phase 3: User Story 1 (remove registration notification)
4. **STOP and VALIDATE**: Test registration flow, verify no notification sent
5. Deploy to staging for verification

### Incremental Delivery

1. Setup + Foundational → Safe to receive stray events
2. User Story 1 → Registration notification removed → Deploy (MVP!)
3. User Story 2 → Cross-repo spec verified → Handoff to infrastructure team
4. User Story 3 → Spec refinements → Final documentation
5. Polish → Full verification → Production deployment

### Suggested MVP Scope

**MVP = Phase 1 + Phase 2 + Phase 3 (User Story 1)**

This removes the registration notification with graceful handling of stray events. The cross-repo specification (US2/US3) can proceed in parallel or follow immediately after.

---

## Notes

- Keep `lib/src/dto/platform/notification.event.payload.platform.user.registration.ts` to avoid breaking change
- No existing unit tests for registration notifications - manual testing per research.md
- Stray events during deployment transition will be logged and silently dropped (no error, no email)
- Commit after each logical task group for easy rollback
