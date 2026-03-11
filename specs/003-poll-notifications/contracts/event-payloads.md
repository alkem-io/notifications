# Event Payload Contracts: Community Poll Notifications

**Date**: 2026-03-09 | **Feature**: 003-poll-notifications

## Shared Types

### PollPayload

```typescript
export type PollPayload = {
  title: string;  // Display title of the poll
  url: string;    // Direct URL to the poll
};
```

## Event Payloads

All payloads are received via RabbitMQ from the Alkemio server. The notifications service is a consumer only — it does not publish events.

### SPACE_COLLABORATION_POLL_VOTE_CAST_ON_OWN_POLL

**Trigger**: A member votes on a poll; sent to the poll creator.

```typescript
interface NotificationEventPayloadSpacePollVoteCastOnOwnPoll
  extends NotificationEventPayloadSpace {
  poll: PollPayload;
}
```

| Field              | Source        | Used in email?       |
|--------------------|---------------|----------------------|
| triggeredBy        | Voter         | Yes — voter name     |
| recipients[]       | Poll creator  | Yes — email target   |
| space              | Poll's space  | Yes — space name/URL |
| poll.calloutTitle  | Poll          | Yes                  |
| poll.calloutUrl    | Poll          | Yes — CTA link       |

### SPACE_COLLABORATION_POLL_VOTE_CAST_ON_POLL_I_VOTED_ON

**Trigger**: A member votes on a poll; sent to all prior voters (excluding current voter).

```typescript
interface NotificationEventPayloadSpacePollVoteCastOnPollIVotedOn
  extends NotificationEventPayloadSpace {
  poll: PollPayload;
}
```

| Field              | Source         | Used in email?       |
|--------------------|----------------|----------------------|
| triggeredBy        | Voter          | Yes — voter name     |
| recipients[]       | Prior voters   | Yes — email targets  |
| space              | Poll's space   | Yes — space name/URL |
| poll.calloutTitle  | Poll           | Yes                  |
| poll.calloutUrl    | Poll           | Yes — CTA link       |

### SPACE_COLLABORATION_POLL_MODIFIED_ON_POLL_I_VOTED_ON

**Trigger**: A poll is modified; sent to voters whose votes are NOT affected.

```typescript
interface NotificationEventPayloadSpacePollModifiedOnPollIVotedOn
  extends NotificationEventPayloadSpace {
  poll: PollPayload;
}
```

| Field              | Source           | Used in email?         |
|--------------------|------------------|------------------------|
| triggeredBy        | Modifier         | No — impersonal email  |
| recipients[]       | Unaffected voters| Yes — email targets    |
| space              | Poll's space     | Yes — space name/URL   |
| poll.calloutTitle  | Poll             | Yes                    |
| poll.calloutUrl    | Poll             | Yes — CTA link         |

### SPACE_COLLABORATION_POLL_VOTE_AFFECTED_BY_OPTION_CHANGE

**Trigger**: A poll option is removed/changed; sent to voters whose vote was invalidated.

```typescript
interface NotificationEventPayloadSpacePollVoteAffectedByOptionChange
  extends NotificationEventPayloadSpace {
  poll: PollPayload;
}
```

| Field              | Source          | Used in email?         |
|--------------------|-----------------|------------------------|
| triggeredBy        | Modifier        | No — impersonal email  |
| recipients[]       | Affected voters | Yes — email targets    |
| space              | Poll's space    | Yes — space name/URL   |
| poll.calloutTitle  | Poll            | Yes                    |
| poll.calloutUrl    | Poll            | Yes — CTA link         |

## Email Template Payloads

### PollVoteCastEmailPayload

Used by both vote-cast templates.

```typescript
interface PollVoteCastEmailPayload extends BaseSpaceEmailPayload {
  poll: {
    title: string;
    url: string;
  };
  voter: {
    name: string;
  };
}
```

### PollModifiedEmailPayload

Used by both modification/affected templates.

```typescript
interface PollModifiedEmailPayload extends BaseSpaceEmailPayload {
  poll: {
    title: string;
    url: string;
  };
}
```
