# Research: GraphQL-Sourced Notification Email Blacklist

## Decisions

### D1: Source of Truth for Blacklist
- **Decision**: Use the Alkemio platform GraphQL field `platform.settings.integration.notificationEmailBlacklist` as the sole dynamic source of truth for the notification email blacklist when GraphQL sync is enabled.
- **Rationale**: This field is already managed via platform admin mutations (`addNotificationEmailToBlacklist` and `removeNotificationEmailFromBlacklist`) and is the interface exposed in PR #5622, ensuring a single control plane for blacklist management.
- **Alternatives considered**:
  - Continue to rely on static `notifications.yml` configuration only: rejected because it requires service restarts/redeploys for every blacklist change and duplicates configuration between platform and notifications.
  - Implement a custom REST endpoint for blacklist retrieval: rejected because it would duplicate GraphQL capabilities and require additional server maintenance.

### D2: Sync Strategy and Refresh Interval
- **Decision**: Implement a periodic background sync job inside the notifications service that fetches the blacklist on startup and then refreshes it every configurable interval (default 5 minutes) using a single GraphQL query.
- **Rationale**: Periodic polling keeps implementation simple and robust, satisfies the ≤5 minute propagation requirement, and avoids tighter coupling to mutation events or message buses.
- **Alternatives considered**:
  - Event-driven sync via AMQP or subscription to mutation events: rejected for MVP due to added complexity and cross-service coupling; can be revisited later if the polling model proves insufficient.
  - On-demand fetch per notification send: rejected to avoid adding latency and load to the GraphQL API on every notification.

### D3: Failure Semantics (Startup and Refresh)
- **Decision**: On startup, if GraphQL is unreachable or returns errors, the service will log a high-priority error and start with an empty blacklist (fail-open). On subsequent refresh failures, it will retain the last successful snapshot, log the failure, and back off retries with exponential backoff.
- **Rationale**: Failing open preserves the ability to deliver notifications even during GraphQL outages while still honoring previously fetched blacklist entries once they exist. Retaining the last snapshot prevents partial/empty data from accidentally unblocking or over-blocking users during transient errors.
- **Alternatives considered**:
  - Fail-closed on startup (block all emails until first successful sync): rejected as too disruptive and likely to cause widespread delivery outages when GraphQL is misconfigured.
  - Always replace snapshot with the latest response even on partial failure: rejected due to risk of partial data corrupting the blacklist state.

### D4: Normalization and Limits
- **Decision**: Normalize all emails from GraphQL by trimming whitespace, lowercasing, and deduplicating; ignore entries that do not match a simple email pattern (e.g., contain no `@`). Respect the upstream limit (250 entries) and log a warning if more entries are returned, but never crash.
- **Rationale**: Normalization ensures consistent comparison with recipient emails, and defensive handling of invalid data or overlong lists prevents sync failures due to upstream configuration mistakes.
- **Alternatives considered**:
  - Enforce stricter email validation (RFC 5322 compliant): rejected as unnecessary complexity for MVP; simple validation is sufficient given upstream validation.
  - Hard-fail sync when invalid entries or limits are exceeded: rejected to avoid taking down blacklist enforcement due to non-critical data issues.

### D5: Configuration and Toggle
- **Decision**: Add configuration keys to enable/disable GraphQL blacklist sync and to set the refresh interval; default to enabling GraphQL sync in production-like environments where the platform GraphQL API is available.
- **Rationale**: A toggle allows QA/isolated environments without GraphQL to continue using the existing static blacklist configuration and provides a safe rollback path if issues are discovered.
- **Alternatives considered**:
  - Force GraphQL sync in all environments: rejected due to environments without a running platform GraphQL API.
  - Keep static config and GraphQL in parallel without a clear precedence rule: rejected to avoid ambiguity; precedence will be clearly defined per-environment via configuration.

### D6: Implementation Location and Patterns
- **Decision**: Implement the blacklist sync logic as a dedicated injectable service within `service/src/services/notification` (or a closely related core module), exposing methods to obtain the current snapshot and to trigger refresh. Integrate it with existing recipient filtering logic so that all notification sends check against the snapshot.
- **Rationale**: Keeping the sync and application logic close to notification orchestration makes it easier to reason about and test end-to-end, while still respecting existing NestJS module patterns.
- **Alternatives considered**:
  - Implementing a generic platform GraphQL client module and a separate blacklist module: deferred until there is a second use-case for GraphQL within notifications.

## Remaining Questions (Resolved from "NEEDS CLARIFICATION")

- **GraphQL client library**: Prefer reusing any existing lightweight GraphQL client already used in `service/` (e.g., `graphql-request` if present). If none is present, introduce a minimal dependency with explicit configuration in `service/package.json`.
- **Authentication mechanism**: Use the existing machine-to-machine token configuration used for other service-to-platform calls (e.g., bearer token from environment/config) and wire it into the GraphQL client; exact env var names will be confirmed against current `configuration.ts` patterns.
- **Platform selection**: Assume one platform ID per deployment; platform identifier (if required by the query) will come from existing configuration used for other platform-scoped operations.
