# Feature Specification: Community Poll Notification Emails

**Feature Branch**: `003-poll-notifications`
**Created**: 2026-03-09
**Status**: Draft
**Input**: User description: "Add poll notification events and email templates for community polls feature, based on server-side changes introducing four new poll-related notification events."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Poll Creator Receives Vote Notification (Priority: P1)

A space member creates a poll within a collaboration space. When another member casts a vote on that poll, the creator receives an email notification informing them that someone has voted on their poll. The email includes the voter's name, the poll title, the space name, and a link to view the poll.

**Why this priority**: The poll creator is the primary stakeholder who needs feedback on participation. This is the most fundamental poll notification — it drives creator engagement and confirms the poll is receiving responses.

**Independent Test**: Can be fully tested by publishing a `SPACE_COLLABORATION_POLL_VOTE_CAST_ON_OWN_POLL` event to the message queue with a valid payload and verifying the correct email is generated and sent to the poll creator.

**Acceptance Scenarios**:

1. **Given** a poll creator has email notifications enabled for this event, **When** another member casts a vote on their poll, **Then** the creator receives an email with the voter's display name, poll title, space name, and a link to the poll.
2. **Given** the poll creator has disabled this notification preference, **When** a vote is cast, **Then** no email is sent.
3. **Given** the poll creator is also the voter, **When** they cast a vote on their own poll, **Then** no email is sent (the server excludes the voter from recipients).

---

### User Story 2 — Prior Voters Notified of New Votes (Priority: P2)

A member who previously voted on a poll receives an email notification when another member also votes on the same poll. The email includes the new voter's name, the poll title, the space name, and a link to view updated results.

**Why this priority**: Keeping voters informed of ongoing participation maintains community engagement and encourages members to revisit results.

**Independent Test**: Can be fully tested by publishing a `SPACE_COLLABORATION_POLL_VOTE_CAST_ON_POLL_I_VOTED_ON` event and verifying the correct email is sent to prior voters (excluding the current voter).

**Acceptance Scenarios**:

1. **Given** a member has voted on a poll and has this notification enabled, **When** another member votes on the same poll, **Then** the prior voter receives an email with the new voter's name, poll title, space name, and a link to the poll.
2. **Given** the recipient has disabled this notification preference, **When** a new vote is cast, **Then** no email is sent.
3. **Given** the current voter is also a prior voter (changing their vote), **When** they re-vote, **Then** they do not receive a notification about their own action.

---

### User Story 3 — Voters Notified of Poll Modifications (Priority: P3)

A member who voted on a poll receives an email notification when the poll is modified (options added, reordered, or text updated) but their specific vote is not affected by the change. The email informs them that the poll has been updated and invites them to review the changes.

**Why this priority**: Keeping voters informed of structural poll changes builds trust and transparency. This notification covers non-destructive changes where the voter's selections remain valid.

**Independent Test**: Can be fully tested by publishing a `SPACE_COLLABORATION_POLL_MODIFIED_ON_POLL_I_VOTED_ON` event and verifying the correct email is sent to unaffected voters.

**Acceptance Scenarios**:

1. **Given** a voter's selections are not affected by the poll modification, **When** a facilitator adds a new option or reorders options, **Then** the voter receives an email with impersonal phrasing (e.g., "A poll you voted on was modified"), the poll title, space name, and a link to the poll.
2. **Given** the voter has disabled this notification preference, **When** the poll is modified, **Then** no email is sent.

---

### User Story 4 — Voters Notified When Their Vote Is Affected (Priority: P4)

A member who voted on a poll receives an email notification when their specific vote is invalidated due to a poll option being removed or substantially changed. The email clearly communicates that their vote has been affected and they may need to re-vote.

**Why this priority**: This is a critical trust notification. When a voter's choice is removed or altered, they must be informed so they can take corrective action. Although lower frequency than other notifications, the impact on individual users is high.

**Independent Test**: Can be fully tested by publishing a `SPACE_COLLABORATION_POLL_VOTE_AFFECTED_BY_OPTION_CHANGE` event and verifying the correct email is sent to affected voters.

**Acceptance Scenarios**:

1. **Given** a voter selected an option that has been removed, **When** the removal triggers the event, **Then** the voter receives an email explaining their vote was affected, with the poll title, space name, and a link to re-vote.
2. **Given** a voter selected an option whose text was substantially changed (causing vote deletion), **When** the update triggers the event, **Then** the voter receives an email explaining their vote was affected.
3. **Given** the voter has disabled this notification preference, **When** their vote is affected, **Then** no email is sent.

---

### Edge Cases

- What happens when multiple votes are cast on the same poll in rapid succession? Each event is processed independently; the poll creator and prior voters may receive multiple emails. No batching or deduplication is applied in this iteration.
- What happens when the notification event references a poll or space that no longer exists? The email builder should handle missing data gracefully and log a warning without crashing.
- What happens when a recipient's email address is blacklisted? The existing blacklist service filters them out before email generation, as with all other notification types.
- What happens when the event payload is malformed or missing required fields? The service should log the error and skip the notification without affecting other queued events.
- What happens when the poll URL is null or empty in the event payload? The poll URL is a required field provided by the server. If absent, the payload is considered malformed and the existing error handling logs and skips the notification.

## Requirements *(mandatory)*

### Functional Requirements

**Event Processing**

- **FR-001**: The service MUST accept and process `SPACE_COLLABORATION_POLL_VOTE_CAST_ON_OWN_POLL` events from the message queue and generate email notifications to the poll creator.
- **FR-002**: The service MUST accept and process `SPACE_COLLABORATION_POLL_VOTE_CAST_ON_POLL_I_VOTED_ON` events from the message queue and generate email notifications to prior voters.
- **FR-003**: The service MUST accept and process `SPACE_COLLABORATION_POLL_MODIFIED_ON_POLL_I_VOTED_ON` events from the message queue and generate email notifications to unaffected voters.
- **FR-004**: The service MUST accept and process `SPACE_COLLABORATION_POLL_VOTE_AFFECTED_BY_OPTION_CHANGE` events from the message queue and generate email notifications to affected voters.

**Email Content**

- **FR-005**: Each poll notification email MUST include the poll title, the space name, and a direct link to the poll within the space.
- **FR-006**: Vote-related notification emails (FR-001, FR-002) MUST include the voter's display name.
- **FR-007**: Poll modification emails (FR-003) MUST communicate that the poll has been updated and invite the recipient to review changes.
- **FR-008**: Vote-affected emails (FR-004) MUST clearly communicate that the recipient's vote has been invalidated and they may need to re-vote.
- **FR-009**: All poll notification emails MUST follow the existing email template layout (transactional template with standard header, body, call-to-action button, and notification preferences footer).

**Event Payload Structure**

- **FR-010**: All four poll event payloads MUST extend the existing space event payload base, including space context (name, URL) and triggeredBy information.
- **FR-011**: Poll event payloads MUST include poll-specific data: poll title and poll URL (either directly or derivable from the callout/space URL structure).
- **FR-012**: Each of the four poll event types MUST have its own dedicated event payload DTO, even if fields overlap initially, to allow independent extension as requirements evolve.

**Integration**

- **FR-013**: The service MUST register all four new event types in the event-to-template mapping and event-to-payload-builder mapping.
- **FR-014**: The service MUST reuse the existing blacklist filtering, recipient processing, and email delivery infrastructure without modification.

### Key Entities

- **Poll Vote Cast On Own Poll Event**: Event payload for when someone votes on a poll the recipient created. Contains event type, triggered-by user (voter), recipient list, space context, and poll data (title, URL).
- **Poll Vote Cast On Poll I Voted On Event**: Event payload for when someone votes on a poll the recipient also voted on. Same base fields as above.
- **Poll Modified On Poll I Voted On Event**: Event payload for when a poll the recipient voted on is modified without affecting their vote. Contains space context and poll data (title, URL). Modifier identity is not surfaced in the email.
- **Poll Vote Affected By Option Change Event**: Event payload for when the recipient's vote is invalidated by an option change. Contains space context and poll data (title, URL). Modifier identity is not surfaced in the email.
- **Poll Email Payload**: A template-ready data structure containing recipient info, space context, poll title, poll URL, and action-specific details (voter/modifier name) used to render the notification email.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All four poll notification event types are processed end-to-end, from message queue receipt to email delivery, without errors for valid payloads.
- **SC-002**: Poll notification emails render correctly with all required content (poll title, space name, link, action-specific details) matching the established email template design.
- **SC-003**: Recipients who have disabled a specific poll notification preference do not receive emails for that event type.
- **SC-004**: Malformed or incomplete event payloads are logged and skipped without affecting the processing of other queued events.
- **SC-005**: The four new notification types integrate seamlessly with the existing blacklist, recipient filtering, and delivery infrastructure — no regressions in existing notification types.

## Clarifications

### Session 2026-03-09

- Q: Should all four poll events share a single event payload DTO, or have separate DTOs? → A: Four separate DTOs, one per event type, to allow independent extension.
- Q: Should modification and vote-affected emails include the modifier's name? → A: No; use impersonal phrasing (e.g., "A poll you voted on was modified").

## Assumptions

- The server publishes the four new poll notification events to the same RabbitMQ exchange used by all other Alkemio notifications.
- Poll event payloads follow the same base structure as existing space events (`BaseEventPayload` with `space`, `triggeredBy`, and `recipients` fields), extended with poll-specific data.
- The `NotificationEvent` enum in the generated schema will include the four new event types after running codegen against the updated server schema.
- Notification preference filtering is handled server-side when determining recipients; the notifications service sends to all recipients included in the event payload.
- Poll URLs follow the existing pattern where the callout URL within a space is sufficient to link directly to the poll.
- No batching or deduplication of notifications is required in this iteration — each event results in individual emails to each recipient.
- Email template content and wording will follow existing Alkemio notification tone and style conventions.
