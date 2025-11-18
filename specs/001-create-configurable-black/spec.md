# Feature Specification: Configurable Email Blacklist for Notifications

**Feature Branch**: `001-create-configurable-black`  
**Created**: 2025-11-18  
**Status**: Draft  
**Input**: User description: "create a configurable black list of emails that should not receive notifications"

## Clarifications

### Session 2025-11-18

- Q: Should the blacklist support only exact email addresses, or also domain-level patterns and wildcards? 
  → A: Support only exact email addresses for v1.
 - Q: Should the blacklist take precedence over user-level subscription preferences, and is it global across all tenants/spaces? 
  → A: Blacklist is global and always takes precedence.

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

### User Story 1 - Prevent emails to blacklisted addresses (Priority: P1)

An operations administrator maintains a list of email addresses that must not receive any notification emails (for example, legal hold addresses, test accounts, or users who must be blocked at the notifications layer). When the system attempts to send a notification email to any blacklisted address, the email is not sent and the event is logged, while notifications to non-blacklisted addresses continue to work normally.

**Why this priority**: This prevents misdelivery of notifications to sensitive or blocked addresses and avoids potential legal, privacy, or abuse issues. It protects the platform even if upstream systems misconfigure recipients.

**Independent Test**: Configure at least one blacklisted email address, trigger an event that would send a notification to that address, and verify that no email is sent to the blacklisted address while other recipients still receive their notifications.

**Acceptance Scenarios**:

1. **Given** a configured blacklist containing `blocked@example.org`, **When** a notification is triggered to `blocked@example.org`, **Then** the notifications service must not send an email to `blocked@example.org` and must record that the send was blocked by the blacklist.
2. **Given** a configured blacklist containing `blocked@example.org` and a recipient list `blocked@example.org`, `allowed@example.org`, **When** a notification is triggered to both recipients, **Then** only `allowed@example.org` receives the notification email and the blocked address is skipped with an appropriate log entry.

---

### User Story 2 - Configure and manage the blacklist (Priority: P2)

An operations administrator can configure and update the blacklist of email addresses without changing application code or rebuilding the service. They can add or remove addresses (and, if supported, domain-level patterns) and have the changes applied by the notifications service within a predictable time frame.

**Why this priority**: Blacklist management must be practical and safe to operate; otherwise the feature will not be usable in real environments. Configuration-based control reduces deployment overhead and allows quick reaction to incidents.

**Independent Test**: Start the notifications service with an initial blacklist configuration, trigger events to verify behavior, then change the configuration (e.g., add or remove an address) and confirm that subsequent notifications respect the updated blacklist without code changes.

**Acceptance Scenarios**:

1. **Given** a running notifications service and a configuration file or environment variable containing a blacklist with `blocked1@example.org`, **When** the operator updates the configuration to add `blocked2@example.org` and reloads/restarts the service according to documented steps, **Then** subsequent notifications to either `blocked1@example.org` or `blocked2@example.org` are blocked.

---

### User Story 3 - Observe and audit blacklist behavior (Priority: P3)

An operations or support engineer can observe when notifications are blocked due to the blacklist and, if needed, audit which addresses were affected over a period of time using logs or metrics. They can distinguish blacklist blocks from other failures (for example, SMTP errors).

**Why this priority**: Observability helps diagnose unexpected missing emails and ensures the blacklist does not silently hide configuration errors or regressions.

**Independent Test**: Trigger notifications to blacklisted and non-blacklisted addresses and verify that logs or metrics clearly indicate when the blacklist caused a notification to be skipped, distinct from other errors.

**Acceptance Scenarios**:

1. **Given** a configured blacklist and logging enabled, **When** a notification to a blacklisted address is blocked, **Then** the service logs a structured entry indicating that the recipient was blacklisted and no send attempt was made.
2. **Given** a configured blacklist and metrics/monitoring, **When** a notification to a blacklisted address is blocked, **Then** an appropriate counter or metric is incremented so that the rate of blacklist blocks can be monitored over time (subject to existing observability capabilities).

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

- What happens when the recipient list contains only blacklisted addresses? The system should not send any emails and should treat the notification as successfully processed but fully filtered, with clear logging.
- What happens when the blacklist configuration is empty or missing? The system should behave as it does today, sending notifications to all eligible recipients and logging that no blacklist is applied if relevant.
- How does the system handle invalid email formats in the blacklist configuration? Invalid entries should be ignored with a warning, without breaking notification delivery for valid recipients.
- How does the system handle domain-level blocking (e.g., `@example.org`) versus specific addresses? For v1, the blacklist supports only exact email addresses (e.g., `user@example.org`); domain-level or wildcard blocking is out of scope.
- What happens if the same email address appears multiple times in configuration (duplicates)? The system should treat the address as blacklisted once without error.
- How does the system behave when configuration is reloaded while notifications are in-flight? In-flight notifications may use the previous configuration; newly processed notifications must use the latest configuration after reload/restart.

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: The notifications service MUST support a configurable blacklist of email addresses (exact addresses only in v1) that are excluded from receiving any notification emails.
- **FR-002**: The blacklist MUST be configurable via existing configuration mechanisms (for example, configuration files or environment variables) without requiring changes to application code or rebuilding the service.
- **FR-003**: The notifications service MUST evaluate the blacklist after determining the intended recipients and before attempting to send emails, ensuring that blacklisted addresses are removed from the final recipient list passed to the email transport.
- **FR-004**: The blacklist MUST apply consistently across all notification types and templates handled by the service, regardless of the triggering event or domain (space, organization, platform, user, etc.).
- **FR-005**: When a recipient is skipped due to the blacklist, the service MUST log a clear, structured message indicating the recipient, the reason (blacklisted), and enough context to correlate with the originating notification event, without logging sensitive content from the email body.
- **FR-006**: The system MUST ensure that blacklisted recipients do not receive notifications even if they appear multiple times or via different paths in the notification flow (for example, as direct recipients and as part of a group or role expansion).
- **FR-007**: The feature MUST include at least one independently testable end-to-end scenario where a notification is triggered, recipients are resolved, the blacklist is applied, and the absence of email to blacklisted addresses is verified.
- **FR-008**: Any changes to DTOs or event payloads (if needed for auditing or configuration) MUST be captured in `lib/src/dto/**` and referenced here, but the core blacklist behavior SHOULD be implemented within the service configuration and email sending pipeline where possible.
- **FR-009**: The system MUST define and document how conflicts between this blacklist and any existing opt-out/unsubscribe mechanisms are resolved. The blacklist is global across all tenants/spaces and always takes precedence: if an email address is blacklisted, no notifications are sent to it regardless of user-level subscription preferences.

### Key Entities *(include if feature involves data)*

- **Email Recipient**: Represents an individual email address resolved as a target for a notification. Key attributes include the email address string and any associated user or domain context used for logging (for example, user ID or tenant ID), but the blacklist operates purely on the email address value.
- **Email Blacklist Entry**: Represents a single configured item in the blacklist as an **exact email address** (e.g., `user@example.org`) in v1. Future versions MAY add support for patterns (for example, domain-level entries), but this feature explicitly scopes blacklist entries to exact addresses only.
- **Notification Event**: Existing concept representing an event that triggers one or more notification emails. This feature does not change event structure but relies on resolved recipients being filtered against the blacklist before delivery.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: 100% of emails addressed exclusively to blacklisted recipients are blocked by the notifications service (i.e., no emails are sent to those recipients through this system).
- **SC-002**: In mixed recipient lists, at least 99% of non-blacklisted recipients continue to receive notifications successfully while blacklisted recipients are consistently filtered out.
- **SC-003**: Operations teams can identify the reason for a blocked notification due to the blacklist from logs or monitoring in under 5 minutes during incident investigation, based on clear and structured logging.
- **SC-004**: Support tickets related to unwanted notifications being sent to known blocked or test addresses are reduced by at least 50% within one release cycle after the feature is enabled (where such tickets previously existed).

### Future Extensions

- Pattern or domain-level blacklist entries (for example, `@example.org`) may be considered as a separate feature; this specification explicitly excludes them from v1.
