# Data Model: Community Poll Notification Emails

**Date**: 2026-03-09 | **Feature**: 003-poll-notifications

## Entities

### PollPayload (new shared type)

| Field   | Type   | Description                        |
|---------|--------|------------------------------------|
| title   | string | Display title of the poll          |
| url     | string | Direct URL to the poll in the space |

**Location**: `lib/src/dto/space/poll.payload.ts`

### NotificationEventPayloadSpacePollVoteCastOnOwnPoll

Extends `NotificationEventPayloadSpace`

| Field | Type        | Description                          |
|-------|-------------|--------------------------------------|
| poll  | PollPayload | Poll that received the vote          |

**Inherited**: `eventType`, `triggeredBy` (voter), `recipients` (poll creator), `platform`, `space`

### NotificationEventPayloadSpacePollVoteCastOnPollIVotedOn

Extends `NotificationEventPayloadSpace`

| Field | Type        | Description                          |
|-------|-------------|--------------------------------------|
| poll  | PollPayload | Poll that received the vote          |

**Inherited**: `eventType`, `triggeredBy` (voter), `recipients` (prior voters), `platform`, `space`

### NotificationEventPayloadSpacePollModifiedOnPollIVotedOn

Extends `NotificationEventPayloadSpace`

| Field | Type        | Description                             |
|-------|-------------|-----------------------------------------|
| poll  | PollPayload | Poll that was modified                  |

**Inherited**: `eventType`, `triggeredBy` (modifier — not surfaced in email), `recipients` (unaffected voters), `platform`, `space`

### NotificationEventPayloadSpacePollVoteAffectedByOptionChange

Extends `NotificationEventPayloadSpace`

| Field | Type        | Description                             |
|-------|-------------|-----------------------------------------|
| poll  | PollPayload | Poll whose option change affected votes |

**Inherited**: `eventType`, `triggeredBy` (modifier — not surfaced in email), `recipients` (affected voters), `platform`, `space`

---

## Email Template Payloads

### PollVoteCastEmailPayload

Extends `BaseSpaceEmailPayload`

| Field              | Type   | Description                    |
|--------------------|--------|--------------------------------|
| poll.title         | string | Poll title                     |
| poll.url           | string | Direct link to poll            |
| voter.name         | string | Display name of the voter      |

**Used by**: vote-cast-on-own-poll, vote-cast-on-poll-i-voted-on

### PollModifiedEmailPayload

Extends `BaseSpaceEmailPayload`

| Field              | Type   | Description                    |
|--------------------|--------|--------------------------------|
| poll.title         | string | Poll title                     |
| poll.url           | string | Direct link to poll            |

**Used by**: poll-modified-on-poll-i-voted-on, vote-affected-by-option-change

---

## Relationships

```
BaseEventPayload
  └── NotificationEventPayloadSpace (adds space: SpacePayload)
        ├── NotificationEventPayloadSpacePollVoteCastOnOwnPoll (adds poll: PollPayload)
        ├── NotificationEventPayloadSpacePollVoteCastOnPollIVotedOn (adds poll: PollPayload)
        ├── NotificationEventPayloadSpacePollModifiedOnPollIVotedOn (adds poll: PollPayload)
        └── NotificationEventPayloadSpacePollVoteAffectedByOptionChange (adds poll: PollPayload)

BaseEmailPayload
  └── BaseSpaceEmailPayload (adds space display info)
        ├── PollVoteCastEmailPayload (adds voter + poll)
        └── PollModifiedEmailPayload (adds poll only)
```

## State Transitions

N/A — These are stateless notification events. Each event is processed independently with no state persistence.

## Validation Rules

- All four event payloads require: `eventType`, `triggeredBy`, `recipients` (≥1), `platform.url`, `space` (with `id`, `profile.displayName`, `profile.url`), `poll` (with `title`, `url`).
- Vote-cast events: `triggeredBy` represents the voter; must have valid `profile.displayName`.
- Modification events: `triggeredBy` is present but not rendered in email templates.
- Malformed payloads are logged and skipped (existing error handling in notification service).
