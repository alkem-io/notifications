# Data Model: GraphQL-Sourced Notification Email Blacklist

## Entities

### Notification Email Blacklist Snapshot
- **Description**: Immutable in-memory snapshot of normalized email addresses currently blacklisted for notifications.
- **Fields**:
  - `emails: string[]` — List of unique, lowercased, trim-normalized email addresses.
  - `fetchedAt: Date` — Timestamp when this snapshot was fetched from GraphQL.
  - `sourceVersion?: string` — Optional version or ETag-like identifier if exposed by GraphQL in future.
  - `platformId?: string` — Optional platform identifier if needed to support multi-platform in future.
- **Relationships**:
  - Applied to all notification sends whose recipient email matches any entry in `emails`.
- **Validation Rules**:
  - Emails must be lowercased and trimmed.
  - Invalid email strings (e.g., missing `@`) are excluded from `emails` but can be logged with their raw value.

### GraphQL Sync Job
- **Description**: Internal process/service responsible for periodically fetching the blacklist from GraphQL and updating the current snapshot.
- **Fields (internal state)**:
  - `lastSnapshot?: NotificationEmailBlacklistSnapshot` — Last successful snapshot, if any.
  - `lastErrorAt?: Date` — Timestamp of the last failed sync attempt.
  - `consecutiveFailures: number` — Counter used to compute exponential backoff.
  - `intervalMs: number` — Configured base interval between successful syncs (default: 5 minutes).
- **State Transitions**:
  - `Idle` → `Syncing` → `Success` (update `lastSnapshot`, reset `consecutiveFailures`).
  - `Idle` → `Syncing` → `Failure` (keep `lastSnapshot`, increment `consecutiveFailures`, schedule next attempt using backoff).

### Blacklist Enforcement Context
- **Description**: Derived context used when processing a notification send to decide whether to deliver or drop by email.
- **Fields**:
  - `recipientEmail: string` — Email address extracted from the notification recipient.
  - `blacklisted: boolean` — Whether the recipient is currently blacklisted.
  - `snapshotFetchedAt?: Date` — Timestamp from the snapshot used for this decision (for logging).
  - `reason?: 'blacklisted' | 'not_blacklisted'` — Reason code for audit logging.

## Invariants and Constraints

- The notifications service MUST be able to operate with an empty snapshot (`emails = []`) and treat it as "no addresses blacklisted".
- Snapshot updates MUST be atomic from the perspective of notification processing (i.e., readers always see a complete snapshot, never a partially updated list).
- The blacklist size MUST never exceed the upstream limit (250) in practice, but the service MUST behave safely if it does (e.g., truncate or log a warning instead of throwing).
- In the presence of sync failures, the previous `lastSnapshot` MUST remain effective until a new successful snapshot is fetched.
