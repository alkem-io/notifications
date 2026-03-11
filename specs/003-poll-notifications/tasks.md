# Tasks: Community Poll Notification Emails

**Input**: Design documents from `/specs/003-poll-notifications/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in the feature specification. Test tasks are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Ensure generated schema includes the new event types and shared types are created

- [x] T001 Add four new poll notification event enum values to the GraphQL schema and run `cd service && npm run codegen` to regenerate `service/src/generated/alkemio-schema.ts` — if the server schema is not yet updated, manually add the enum values `SpaceCollaborationPollVoteCastOnOwnPoll`, `SpaceCollaborationPollVoteCastOnPollIVotedOn`, `SpaceCollaborationPollModifiedOnPollIVotedOn`, `SpaceCollaborationPollVoteAffectedByOptionChange` to the `NotificationEvent` enum
- [x] T002 Create `PollPayload` shared type in `lib/src/dto/space/poll.payload.ts` with `title: string` and `url: string` fields

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Event payload DTOs and email template payload interfaces that all user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Create `NotificationEventPayloadSpacePollVoteCastOnOwnPoll` interface extending `NotificationEventPayloadSpace` with `poll: PollPayload` in `lib/src/dto/space/notification.event.payload.space.poll.vote.cast.on.own.poll.ts`
- [x] T004 [P] Create `NotificationEventPayloadSpacePollVoteCastOnPollIVotedOn` interface extending `NotificationEventPayloadSpace` with `poll: PollPayload` in `lib/src/dto/space/notification.event.payload.space.poll.vote.cast.on.poll.i.voted.on.ts`
- [x] T005 [P] Create `NotificationEventPayloadSpacePollModifiedOnPollIVotedOn` interface extending `NotificationEventPayloadSpace` with `poll: PollPayload` in `lib/src/dto/space/notification.event.payload.space.poll.modified.on.poll.i.voted.on.ts`
- [x] T006 [P] Create `NotificationEventPayloadSpacePollVoteAffectedByOptionChange` interface extending `NotificationEventPayloadSpace` with `poll: PollPayload` in `lib/src/dto/space/notification.event.payload.space.poll.vote.affected.by.option.change.ts`
- [x] T007 Export all new DTOs from `lib/src/dto/space/index.ts` — add export lines for `poll.payload`, and all four new event payload files
- [x] T008 Build the lib to verify exports: `cd lib && npm run build`
- [x] T009 [P] Create `PollVoteCastEmailPayload` interface extending `BaseSpaceEmailPayload` with `poll: { title: string; url: string }` and `voter: { name: string }` in `service/src/services/notification/email-template-payload/space.poll.vote.cast.email.payload.ts`
- [x] T010 [P] Create `PollModifiedEmailPayload` interface extending `BaseSpaceEmailPayload` with `poll: { title: string; url: string }` in `service/src/services/notification/email-template-payload/space.poll.modified.email.payload.ts`
- [x] T011 Export both new email payload interfaces from `service/src/services/notification/email-template-payload/index.ts`

**Checkpoint**: Foundation ready — all DTOs and payload interfaces exist, lib builds successfully. User story implementation can now begin.

---

## Phase 3: User Story 1 — Poll Creator Receives Vote Notification (Priority: P1) 🎯 MVP

**Goal**: When a member votes on a poll, the poll creator receives an email with the voter's name, poll title, space name, and a link to view the poll.

**Independent Test**: Publish a `SPACE_COLLABORATION_POLL_VOTE_CAST_ON_OWN_POLL` event to RabbitMQ with a valid payload and verify the correct email is generated and sent to the poll creator via mailslurper.

### Implementation for User Story 1

- [x] T012 [US1] Add `createEmailTemplatePayloadSpacePollVoteCastOnOwnPoll` method to `service/src/services/notification/notification.email.payload.builder.service.ts` — use `createSpaceBaseEmailPayload()` helper, spread result, add `poll: { title: eventPayload.poll.calloutTitle, url: eventPayload.poll.calloutUrl }` and `voter: { name: eventPayload.triggeredBy.profile.displayName }`; return type `PollVoteCastEmailPayload`. **Note**: If `eventPayload.poll` is missing or incomplete, the existing error handling in `processNotificationEvent()` catches and logs the error without crashing — no additional guards needed in the builder method itself.
- [x] T013 [US1] Add `NotificationEvent.SpaceCollaborationPollVoteCastOnOwnPoll` case to `createEmailPayloadForEvent()` switch in `service/src/services/notification/notification.service.ts` — cast payload to `NotificationEventPayloadSpacePollVoteCastOnOwnPoll` and call the builder method from T012. Also add required imports for the new event payload type and email payload type in the same file.
- [x] T014 [US1] Add `NotificationEvent.SpaceCollaborationPollVoteCastOnOwnPoll` case to `getEmailTemplateToUseForEvent()` switch in `service/src/services/notification/notification.service.ts` — return `'space.collaboration.poll.vote.cast.on.own.poll'`
- [x] T015 [US1] Create Nunjucks email template `service/src/email-templates/space.collaboration.poll.vote.cast.on.own.poll.js` — extend `email-transactional.html`, subject: `{{space.displayName}}: {{voter.name}} voted on your poll`, body: greeting, message that `{{voter.name}}` voted on poll `{{poll.calloutTitle}}` in space `{{space.displayName}}`, CTA button linking to `{{poll.calloutUrl}}` with text "View poll"
- [x] T016 [US1] Verify US1 end-to-end: `cd service && npm run build` succeeds without errors

**Checkpoint**: User Story 1 is fully functional — poll creators receive vote notifications.

---

## Phase 4: User Story 2 — Prior Voters Notified of New Votes (Priority: P2)

**Goal**: When a member votes on a poll, prior voters receive an email with the new voter's name, poll title, space name, and a link to view updated results.

**Independent Test**: Publish a `SPACE_COLLABORATION_POLL_VOTE_CAST_ON_POLL_I_VOTED_ON` event and verify the correct email is sent to prior voters.

### Implementation for User Story 2

- [x] T018 [US2] Add `createEmailTemplatePayloadSpacePollVoteCastOnPollIVotedOn` method to `service/src/services/notification/notification.email.payload.builder.service.ts` — same structure as T012 builder, return type `PollVoteCastEmailPayload`. **Note**: Missing poll data is caught by the existing top-level error handler — no additional guards needed.
- [x] T019 [US2] Add `NotificationEvent.SpaceCollaborationPollVoteCastOnPollIVotedOn` case to `createEmailPayloadForEvent()` switch in `service/src/services/notification/notification.service.ts` — cast payload to `NotificationEventPayloadSpacePollVoteCastOnPollIVotedOn` and call the builder method from T018. Also add required imports for the new event payload type in the same file.
- [x] T020 [US2] Add `NotificationEvent.SpaceCollaborationPollVoteCastOnPollIVotedOn` case to `getEmailTemplateToUseForEvent()` switch in `service/src/services/notification/notification.service.ts` — return `'space.collaboration.poll.vote.cast.on.poll.i.voted.on'`
- [x] T021 [US2] Create Nunjucks email template `service/src/email-templates/space.collaboration.poll.vote.cast.on.poll.i.voted.on.js` — extend `email-transactional.html`, subject: `{{space.displayName}}: {{voter.name}} also voted on "{{poll.calloutTitle}}"`, body: greeting, message that `{{voter.name}}` voted on a poll the recipient also voted on, CTA button linking to `{{poll.calloutUrl}}` with text "View poll"
- [x] T022 [US2] Verify US2 end-to-end: `cd service && npm run build` succeeds without errors

**Checkpoint**: User Stories 1 AND 2 are both functional — vote notifications work for both creators and prior voters.

---

## Phase 5: User Story 3 — Voters Notified of Poll Modifications (Priority: P3)

**Goal**: When a poll is modified without affecting a voter's selections, they receive an email informing them the poll was updated.

**Independent Test**: Publish a `SPACE_COLLABORATION_POLL_MODIFIED_ON_POLL_I_VOTED_ON` event and verify the correct email is sent to unaffected voters.

### Implementation for User Story 3

- [x] T023 [US3] Add `createEmailTemplatePayloadSpacePollModifiedOnPollIVotedOn` method to `service/src/services/notification/notification.email.payload.builder.service.ts` — use `createSpaceBaseEmailPayload()` helper, add `poll: { title: eventPayload.poll.calloutTitle, url: eventPayload.poll.calloutUrl }`; return type `PollModifiedEmailPayload` (no voter/modifier name). **Note**: Missing poll data is caught by the existing top-level error handler — no additional guards needed.
- [x] T024 [US3] Add `NotificationEvent.SpaceCollaborationPollModifiedOnPollIVotedOn` case to `createEmailPayloadForEvent()` switch in `service/src/services/notification/notification.service.ts` — cast payload to `NotificationEventPayloadSpacePollModifiedOnPollIVotedOn` and call the builder method from T023. Also add required imports for the new event payload type in the same file.
- [x] T025 [US3] Add `NotificationEvent.SpaceCollaborationPollModifiedOnPollIVotedOn` case to `getEmailTemplateToUseForEvent()` switch in `service/src/services/notification/notification.service.ts` — return `'space.collaboration.poll.modified.on.poll.i.voted.on'`
- [x] T026 [US3] Create Nunjucks email template `service/src/email-templates/space.collaboration.poll.modified.on.poll.i.voted.on.js` — extend `email-transactional.html`, subject: `{{space.displayName}}: A poll you voted on was updated`, body: greeting, impersonal message that poll `{{poll.calloutTitle}}` in `{{space.displayName}}` has been updated and they may want to review, CTA button linking to `{{poll.calloutUrl}}` with text "Review poll"
- [x] T027 [US3] Verify US3 end-to-end: `cd service && npm run build` succeeds without errors

**Checkpoint**: User Stories 1–3 are functional — vote and modification notifications work.

---

## Phase 6: User Story 4 — Voters Notified When Their Vote Is Affected (Priority: P4)

**Goal**: When a voter's choice is removed or substantially changed, they receive an email explaining their vote was affected and they may need to re-vote.

**Independent Test**: Publish a `SPACE_COLLABORATION_POLL_VOTE_AFFECTED_BY_OPTION_CHANGE` event and verify the correct email is sent to affected voters.

### Implementation for User Story 4

- [x] T028 [US4] Add `createEmailTemplatePayloadSpacePollVoteAffectedByOptionChange` method to `service/src/services/notification/notification.email.payload.builder.service.ts` — same structure as T023 builder, return type `PollModifiedEmailPayload`. **Note**: Missing poll data is caught by the existing top-level error handler — no additional guards needed.
- [x] T029 [US4] Add `NotificationEvent.SpaceCollaborationPollVoteAffectedByOptionChange` case to `createEmailPayloadForEvent()` switch in `service/src/services/notification/notification.service.ts` — cast payload to `NotificationEventPayloadSpacePollVoteAffectedByOptionChange` and call the builder method from T028. Also add required imports for the new event payload type in the same file.
- [x] T030 [US4] Add `NotificationEvent.SpaceCollaborationPollVoteAffectedByOptionChange` case to `getEmailTemplateToUseForEvent()` switch in `service/src/services/notification/notification.service.ts` — return `'space.collaboration.poll.vote.affected.by.option.change'`
- [x] T031 [US4] Create Nunjucks email template `service/src/email-templates/space.collaboration.poll.vote.affected.by.option.change.js` — extend `email-transactional.html`, subject: `{{space.displayName}}: Your vote on "{{poll.calloutTitle}}" was affected`, body: greeting, message that their vote on poll `{{poll.calloutTitle}}` was affected by a change and they may need to re-vote, CTA button linking to `{{poll.calloutUrl}}` with text "Review and re-vote"
- [x] T032 [US4] Verify US4 end-to-end: `cd service && npm run build` succeeds without errors

**Checkpoint**: All four user stories are functional — complete poll notification coverage.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all stories

- [x] T033 Run full service build and lint: `cd service && npm run build && npm run lint`
- [x] T034 Run service tests to verify no regressions: `cd service && npm test`
- [ ] T035 Validate quickstart.md E2E scenario: start services, publish a test event per quickstart.md, confirm email delivery via mailslurper

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (T001, T002 complete)
- **User Stories (Phase 3–6)**: All depend on Foundational (Phase 2) completion
  - User stories can proceed in parallel or sequentially in priority order
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 — no dependencies on other stories
- **User Story 2 (P2)**: Can start after Phase 2 — no dependencies on other stories (reuses `PollVoteCastEmailPayload` from Phase 2)
- **User Story 3 (P3)**: Can start after Phase 2 — no dependencies on other stories (reuses `PollModifiedEmailPayload` from Phase 2)
- **User Story 4 (P4)**: Can start after Phase 2 — no dependencies on other stories (reuses `PollModifiedEmailPayload` from Phase 2)

### Within Each User Story

- Builder method → switch case registrations (including imports) → email template → build verification
- Builder method must exist before switch cases reference it

### Parallel Opportunities

- T003–T006 (all four DTOs) can be created in parallel
- T009–T010 (both email payload interfaces) can be created in parallel
- After Phase 2, all four user stories can be implemented in parallel by different developers
- Within each user story, the builder method must be created first, but switch cases and template can be parallelized after

---

## Parallel Example: Phase 2 Foundation

```bash
# Launch all four DTO files in parallel:
Task: "Create poll vote cast on own poll DTO in lib/src/dto/space/notification.event.payload.space.poll.vote.cast.on.own.poll.ts"
Task: "Create poll vote cast on poll I voted on DTO in lib/src/dto/space/notification.event.payload.space.poll.vote.cast.on.poll.i.voted.on.ts"
Task: "Create poll modified on poll I voted on DTO in lib/src/dto/space/notification.event.payload.space.poll.modified.on.poll.i.voted.on.ts"
Task: "Create poll vote affected by option change DTO in lib/src/dto/space/notification.event.payload.space.poll.vote.affected.by.option.change.ts"

# Then launch both email payload interfaces in parallel:
Task: "Create PollVoteCastEmailPayload in service/src/services/notification/email-template-payload/space.poll.vote.cast.email.payload.ts"
Task: "Create PollModifiedEmailPayload in service/src/services/notification/email-template-payload/space.poll.modified.email.payload.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T002)
2. Complete Phase 2: Foundational (T003–T011)
3. Complete Phase 3: User Story 1 (T012–T017)
4. **STOP and VALIDATE**: Build succeeds, test with mailslurper
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Validate → Deploy (MVP!)
3. Add User Story 2 → Validate → Deploy
4. Add User Story 3 → Validate → Deploy
5. Add User Story 4 → Validate → Deploy (complete coverage)
6. Polish → Final validation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each phase or logical group
- All four stories share the same file modification targets (notification.service.ts, payload builder) — if implementing in parallel, coordinate to avoid merge conflicts
- The NotificationEvent enum values may need manual addition if server schema codegen is not yet available
