# Feature Specification: GraphQL-Sourced Notification Email Blacklist

**Feature Branch**: `002-graphql-blacklist`  
**Created**: 2025-11-19  
**Status**: Draft  
**Input**: User description: "change the blacklist array to be taken via graphql api from the alkemio server. You can see the endpoints in PR 5622."

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Platform admin blacklist updates propagate automatically (Priority: P1)

Platform administrators need notification sends to honor the centrally managed `notificationEmailBlacklist` they edit via Alkemio GraphQL mutations without redeploying or restarting the notifications service.

**Why this priority**: Preventing unwanted emails is the core compliance requirement; changes must take effect quickly after admins add or remove addresses in the control plane.

**Independent Test**: Trigger any notification to a user right after adding/removing their address via `addNotificationEmailToBlacklist`/`removeNotificationEmailFromBlacklist` and verify the service blocks or releases that email within the promised refresh window.

**Acceptance Scenarios**:

1. **Given** an administrator has added `blocked@example.com` through the GraphQL mutation, **When** the notifications service performs its next blacklist sync (≤5 minutes later), **Then** any notification containing that recipient is filtered out without manual config changes.
2. **Given** an address was removed from the blacklist via GraphQL, **When** the next sync completes, **Then** the same recipient can once again receive notifications with no leftover cache preventing delivery.

---

### Edge Cases

- GraphQL query returns more than 250 entries (platform limit) or includes duplicates/uppercase emails—service must deduplicate, lowercase, and warn if limit exceeded without crashing sync.
- Initial startup happens while GraphQL is unreachable—the service must fall back to an empty blacklist (fail-open), emit a high-priority alert, and retry with exponential backoff until it acquires a snapshot.
- The GraphQL API returns a 401 because the service token expired—service must surface authentication-specific errors and stop hammering the API by backing off.
- Blacklist shrinks to zero entries—the service should treat this as a valid snapshot, continue syncing, and confirm via logs/metrics so operators know the system is intentionally allowing all emails.
- Partial failures where network flaps mid-request—service must leave the previous snapshot untouched and report the failed attempt rather than mixing partial data.

## Requirements *(mandatory)*

### Functional Requirements (MVP)

- **FR-001**: The notifications service MUST fetch `platform.settings.integration.notificationEmailBlacklist` via the Alkemio GraphQL API during bootstrap before processing notification jobs, using the existing `alkemio.endpoint` and a machine-to-machine token configured for non-interactive access.
- **FR-002**: The service MUST refresh the blacklist on a configurable interval (default 5 minutes) and apply the new snapshot atomically so that changes initiated via `addNotificationEmailToBlacklist`/`removeNotificationEmailFromBlacklist` propagate without manual restarts.
- **FR-003**: If a refresh fails (non-2xx response, network error, schema mismatch), the service MUST keep using the last successful snapshot, expose the failure via logs, and cap consecutive retries using exponential backoff (initial delay 250 ms, growing exponentially up to a maximum delay of 30 seconds) to avoid overwhelming the API.
- **FR-004**: The service MUST canonicalize the list returned by GraphQL (lowercase, trim whitespace, deduplicate) and enforce the upstream limit (250 entries). Invalid addresses (e.g., missing `@`, missing `.` after `@`, or containing whitespace) should be ignored with explicit logging referencing the original GraphQL payload ID.
- **FR-005**: Regression tests MUST cover (a) a happy path where GraphQL returns new entries and the service blocks recipients accordingly, and (b) a failure path where GraphQL is unavailable yet notifications continue for non-blacklisted users (fail-open) with logs proving the skipped sync.

### Key Entities *(include if feature involves data)*

- **Notification Email Blacklist Snapshot**: Immutable set of normalized email addresses sourced from the latest successful GraphQL query, tagged with `fetched_at`, `platform_id`, and `source_version` metadata for logging and metrics.
- **GraphQL Sync Job**: Background process responsible for authenticating against the Alkemio GraphQL endpoint, executing the query, handling pagination/limits, and publishing snapshot updates to the blacklist service component.
- **Blacklist Audit Event**: Structured log record emitted whenever a recipient is filtered, containing the snapshot timestamp, recipient metadata, reason code (`blacklisted`), and the notification template identifier for downstream analytics.

## Success Criteria *(mandatory)*

### Measurable Outcomes (MVP)

- **SC-001**: 95% of blacklist updates performed via the platform GraphQL mutations are reflected in the notifications service within 5 minutes, measured during QA by comparing mutation timestamps against when the service starts blocking or allowing affected recipients. For this feature, these checks will be performed via the manual flow described in `specs/002-graphql-blacklist/quickstart.md` and external observability tooling, not automated tests.
- **SC-002**: During simulated GraphQL outages lasting up to 30 minutes, the notifications service continues to process ≥99% of non-blacklisted recipients successfully while logging refresh failures, without requiring a service restart or manual config edits. Validation will follow the "Failure Path (GraphQL Unavailable)" steps in `specs/002-graphql-blacklist/quickstart.md` using the target environment's monitoring stack.

## Assumptions & Dependencies

- Notifications service already has access to a non-interactive GraphQL token with permission to read platform settings; no additional authorization scope is required.
- Each deployment targets exactly one platform ID, so a single GraphQL query (no tenant fan-out) provides the complete blacklist.
- The upstream server enforces validation rules (exact match emails, no wildcards); the notifications service only needs to ignore malformed input rather than enforce business validation.
- Environments without Alkemio GraphQL (e.g., isolated QA) can temporarily fall back to the existing static `notifications.yml` blacklist by disabling the sync via configuration, but production will enable the GraphQL path by default.

## Dependencies & Open Risks

- Requires successful rollout of server PR #5622 (or equivalent) so the GraphQL field/mutations exist in all target environments.
- Relies on the observability stack ingesting new metrics/log fields; additional dashboards/alerts must be configured by DevOps before go-live.
- If the GraphQL payload grows materially (>250 entries), we may need pagination support; current spec assumes the upstream hard limit keeps payloads small.
