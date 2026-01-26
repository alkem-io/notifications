# Feature Specification: Remove Registration Successful Notification

**Feature Branch**: `003-remove-registration-notification`
**Created**: 2026-01-26
**Status**: Draft
**Related Issue**: [alkem-io/client-web#9197](https://github.com/alkem-io/client-web/issues/9197)
**Input**: User description: "We have updated our identity management and now identities are being created in Ory Kratos and Alkemio at the same time. Thus invocation of notifications in this repository post account creation is not needed - look at https://github.com/alkem-io/client-web/issues/9197. I also need an output document to be used as spec for the infrastructure-operations and dev-orchestration repositories so the infrastructure and templates need to be updated."

## Background

Previously, user profiles on Alkemio were created upon first login after Kratos account creation. This triggered a "Registration successful!" notification from the notifications service when the Alkemio user profile was created.

With the updated identity management flow, user profiles are now created in both Ory Kratos and Alkemio simultaneously during registration. This results in the "Registration successful!" notification being sent prematurely - before the user has completed email verification.

The agreed solution is to:
1. Remove the registration notification from this notifications service
2. Consolidate all welcome messaging into the Kratos email verification template (handled in infrastructure-operations repository)

## Clarifications

### Session 2026-01-26

- Q: How should the system handle the deployment transition period when stray registration events may still arrive? → A: Complete removal - remove event handler; stray events will throw `EventPayloadNotProvidedException` (fail-early behavior preserved)
- Q: What is the required deployment order across repositories? → A: Notifications first - remove registration notification from this service, then update Kratos templates in infrastructure repositories
- Q: Should any other notifications or email templates be modified as part of this work? → A: Only the user registration notification (`USER_SIGN_UP_WELCOME`) is removed. The admin notification (`PLATFORM_ADMIN_USER_PROFILE_CREATED`) is explicitly kept unchanged, as it serves a separate purpose (admin monitoring of new registrations).
- Q: How should we verify that all essential content has been migrated to Kratos? → A: Side-by-side diff - document exact text from current template, verify 1:1 presence in Kratos template

## User Scenarios & Testing *(mandatory)*

### User Story 1 - New User Registration Experience (Priority: P1)

A new user registers on Alkemio and receives a single, coherent welcome email after completing email verification, rather than receiving multiple emails at different stages of registration.

**Why this priority**: This directly fixes the bug where users receive a premature "Registration successful!" email, improving the registration experience and reducing user confusion.

**Independent Test**: Can be fully tested by completing a new user registration flow and verifying only the Kratos verification email is sent (no separate "Registration successful!" notification).

**Acceptance Scenarios**:

1. **Given** a new user starts registration on Alkemio, **When** they submit their registration details (before email verification), **Then** they receive only the Kratos email verification message (no "Registration successful!" notification).

2. **Given** a user completes email verification, **When** the verification is finalized in Kratos, **Then** they receive the Kratos verification success email which now contains the welcome content previously in the registration notification.

3. **Given** the notifications service is running, **When** a user profile creation event occurs, **Then** no "Registration successful!" email is triggered from the notifications service.

---

### User Story 2 - Infrastructure Template Updates (Priority: P1)

Infrastructure operators need updated Kratos email templates that include the welcome messaging previously sent via the notifications service, ensuring users still receive all necessary information.

**Why this priority**: The Kratos email template must be updated to include the welcome content; otherwise users will lose important information that was previously in the registration notification.

**Independent Test**: Can be tested by reviewing the updated Kratos email template to verify it contains the welcome messaging and by sending a test verification email.

**Acceptance Scenarios**:

1. **Given** the Kratos email template is updated, **When** a user completes email verification, **Then** the email contains both verification success messaging AND the welcome content from the removed registration notification.

2. **Given** infrastructure-operations repository templates, **When** reviewing the Kratos email verification template, **Then** it includes welcome messaging, platform introduction, and any essential onboarding information.

---

### User Story 3 - Cross-Repository Implementation Spec (Priority: P2)

Development teams working on infrastructure-operations and dev-orchestration repositories need a clear specification document outlining what changes are required in their repositories to support this notification consolidation.

**Why this priority**: Without clear specifications, infrastructure teams may miss required changes or implement inconsistent solutions across environments.

**Independent Test**: Can be tested by having infrastructure team review the spec document and confirm it contains all information needed to implement Kratos template changes.

**Acceptance Scenarios**:

1. **Given** the specification document is created, **When** infrastructure team reviews it, **Then** they can understand what Kratos email template changes are required without further clarification.

2. **Given** the specification document, **When** used across infrastructure-operations and dev-orchestration repositories, **Then** both repositories implement consistent Kratos email template updates.

---

### Edge Cases

- What happens if the old notification code is triggered during deployment transition? The registration notification event handler will be completely removed; any stray events received during transition will throw `EventPayloadNotProvidedException` (fail-early behavior preserved).
- How does the system handle users who registered before this change but haven't verified their email yet? They should receive the new consolidated Kratos email upon verification.

## Out of Scope

The following are explicitly **not** part of this feature:

- Modifications to any notifications other than the registration successful notification
- Changes to password reset, email change, or other user lifecycle notifications
- Updates to platform welcome messaging in the UI or other non-email channels
- Review or refactoring of the notification service architecture

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST NOT send a "Registration successful!" notification when a user profile is created in Alkemio
- **FR-002**: System MUST remove or disable the registration successful notification template and associated event handling
- **FR-003**: The Kratos email verification success template MUST be updated to include welcome messaging previously in the registration notification
- **FR-004**: A cross-repository specification document MUST be produced for infrastructure-operations and dev-orchestration teams
- **FR-005**: The specification document MUST detail the exact Kratos email template content changes required
- **FR-006**: The specification document MUST identify which files/templates need modification in infrastructure repositories
- **FR-007**: System MUST maintain backward compatibility for lib consumers - the `NotificationEventPayloadPlatformUserRegistration` DTO is kept to avoid breaking changes to npm consumers

### Key Entities

- **Registration Notification Event**: The event payload that triggers the registration successful notification (to be removed/disabled)
- **Kratos Email Verification Template**: The email template in Kratos that handles verification success messaging (to be updated with welcome content)
- **User Profile**: The Alkemio user profile entity created during registration (no longer triggers notification)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users receive exactly one email during registration flow (the Kratos verification email) instead of two separate emails
- **SC-002**: The consolidated Kratos email contains 100% of the essential information previously split across two emails
- **SC-003**: Zero "Registration successful!" notifications are sent from the notifications service after deployment
- **SC-004**: Infrastructure teams can implement Kratos template changes using only the specification document without requiring additional clarification
- **SC-005**: Registration flow completion rate remains unchanged or improves (no user drop-off due to missing information)

## Output Documents

### Cross-Repository Specification

This specification serves as input for the following repositories:

1. **infrastructure-operations**: Update Kratos email templates to include welcome messaging
2. **dev-orchestration**: Update development environment Kratos configuration/templates

The specification document should include:
- Current registration notification content (what text/information to migrate)
- Target Kratos email template location and structure
- Exact content changes required in Kratos templates
- Deployment coordination notes

### Deployment Order

1. **First**: Deploy notifications service with registration notification removed
2. **Second**: Update Kratos email templates in infrastructure-operations and dev-orchestration repositories

Note: During the transition between step 1 and step 2, users will not receive the welcome content that was previously in the registration notification. This is an accepted temporary gap.

### Content Migration Verification

The cross-repository specification must include:
1. **Exact text extraction**: Document the complete text/content from the current registration notification template (subject line, body, any dynamic fields)
2. **Side-by-side comparison**: Provide a diff-style comparison showing where each piece of content appears in the new Kratos template
3. **Verification checklist**: Infrastructure team confirms 1:1 presence of all extracted content in the updated Kratos email template before deployment

## Assumptions

- The Kratos email verification template supports the additional content without breaking email formatting
- Infrastructure teams have access to modify Kratos email templates
- The registration notification content is available to extract and migrate to Kratos templates
- No other systems depend on the registration notification being sent
