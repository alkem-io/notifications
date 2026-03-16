# Research: Community Poll Notification Emails

**Date**: 2026-03-09 | **Feature**: 003-poll-notifications

## Research Tasks

### 1. Existing Notification Pattern

**Decision**: Follow the exact same pattern used by all existing notifications (e.g., calendar event, community application, callout contribution).

**Rationale**: The codebase has a well-established, consistent pattern for adding notifications. Deviating would introduce unnecessary complexity and maintenance burden.

**Alternatives considered**:
- Generic/dynamic notification handler: Rejected because the existing switch-based routing is explicit, easy to debug, and consistent across 30+ event types.

### 2. Event Payload Structure for Poll Events

**Decision**: Create a `PollPayload` type (analogous to `SpacePayload`, `ContributorPayload`) containing poll-specific fields (`title`, `url`). Each of the four event DTOs extends `NotificationEventPayloadSpace` and includes `poll: PollPayload`.

**Rationale**:
- FR-012 requires four separate DTOs for independent extensibility.
- All four events occur within a space context, so extending `NotificationEventPayloadSpace` provides `space`, `triggeredBy`, `recipients`, and `platform` fields automatically.
- A shared `PollPayload` type avoids field duplication while keeping DTOs independent.

**Alternatives considered**:
- Single shared DTO with discriminator field: Rejected per FR-012 and spec clarification.
- Inline poll fields on each DTO: Rejected because it duplicates the same field set four times without reuse.

### 3. Email Template Payload Grouping

**Decision**: Two email payload interfaces:
1. `PollVoteCastEmailPayload` (extends `BaseSpaceEmailPayload`) — used by both vote-cast events. Includes `voter` name and `poll` data.
2. `PollModifiedEmailPayload` (extends `BaseSpaceEmailPayload`) — used by both modification/affected events. Includes only `poll` data (impersonal phrasing per spec).

**Rationale**: The two vote-cast events share identical email structure (voter name + poll info). The two modification events also share structure (poll info only, no actor name). Grouping reduces template payload duplication while allowing template text to differ.

**Alternatives considered**:
- Four separate payload interfaces: Over-engineered for identical field sets.
- Single unified payload with optional voter field: Loses type safety.

### 4. Email Template Naming Convention

**Decision**: Template names mirror the `NotificationEvent` enum values in kebab-dot-case, matching existing conventions:
- `space.collaboration.poll.vote.cast.on.own.poll`
- `space.collaboration.poll.vote.cast.on.poll.i.voted.on`
- `space.collaboration.poll.modified.on.poll.i.voted.on`
- `space.collaboration.poll.vote.affected.by.option.change`

**Rationale**: Existing templates follow this convention (e.g., `space.admin.community.user.application.received`). Consistency aids discoverability.

### 5. NotificationEvent Enum Values

**Decision**: The four new enum values must exist in the GraphQL schema before codegen. Expected values:
- `SpaceCollaborationPollVoteCastOnOwnPoll`
- `SpaceCollaborationPollVoteCastOnPollIVotedOn`
- `SpaceCollaborationPollModifiedOnPollIVotedOn`
- `SpaceCollaborationPollVoteAffectedByOptionChange`

**Rationale**: These names follow the existing PascalCase convention in the `NotificationEvent` enum (e.g., `SpaceCollaborationCalloutPublished`, `SpaceCommunityCalendarEventCreated`).

**Note**: If the server has not yet added these enum values, `npm run codegen` must be run after the server schema is updated. The implementation can proceed using string literals until codegen is available.

### 6. Poll URL Structure

**Decision**: The event payload includes the poll URL directly (or as part of the callout URL). The notifications service does not construct URLs — it uses whatever the server provides in the payload.

**Rationale**: Per spec assumption: "Poll URLs follow the existing pattern where the callout URL within a space is sufficient to link directly to the poll." The server is responsible for URL construction.
