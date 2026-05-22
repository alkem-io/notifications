# Feature Specification: Email-Change Notification Events

**Feature Branch**: `004-email-change-notifications`
**Created**: 2026-05-20
**Status**: Draft
**Input**: User description: "create the notifications for the prd defined in the 097 spec in the server (../server/specs/097-change-user-email/prd-notifications-email-change.md)"

## Clarifications

### Session 2026-05-20

- Q: For the three email-change messages, which timezone and format should the human-readable change time use? → A: UTC with an explicit "UTC" label (e.g. "20 May 2026, 14:32 UTC")
- Q: On a self-initiated change, what should the global-admin message show as the initiator (given `initiatorProfileSummary` is optional)? → A: The subject's display name with an explicit self-initiation indicator; fall back to `subjectProfileSummary` when `initiatorProfileSummary` is absent
- Q: When the subject of the email change is themselves a platform global administrator, should they be included in the global-admin fan-out? → A: No — exclude the subject from the fan-out for their own change (they already receive the security-signal and new-address messages)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User is alerted that their login email changed (Priority: P1)

When a platform administrator (or the user themselves) changes a user's login
email, the person who owned the **previous** mailbox receives an email at that
old address telling them the change happened. This is a security signal: if the
change was not expected, the recipient learns about it immediately and is told
how to get help. The new email address is shown in a masked form so the message
itself does not leak the new address to a potentially hostile party who may
still control the old mailbox.

**Why this priority**: This is the security-critical outcome. Without it, an
unauthorized email change goes completely unannounced to the affected party.
It delivers value on its own — even if nothing else ships, the at-risk user is
warned.

**Independent Test**: Trigger an email change for a test user and confirm a
single message arrives at the old address, stating the change, showing the
change time, the initiator context, and a masked new address, plus recovery
guidance.

**Acceptance Scenarios**:

1. **Given** a user with a known login email, **When** an administrator changes
   that user's email, **Then** exactly one message is delivered to the old
   address stating the login email was changed.
2. **Given** the security-signal message, **When** the recipient reads it,
   **Then** the new address appears only in masked form and the full new
   address is never present.
3. **Given** the security-signal message, **When** the recipient reads it,
   **Then** it shows when the change occurred, who initiated it (the user
   themselves vs. a platform administrator), and how to contact support.
4. **Given** the old address no longer belongs to an active account, **When**
   the change occurs, **Then** the message is still delivered to that raw
   address, subject only to the existing blacklist/unsubscribe rules.

---

### User Story 2 - New mailbox holder confirms the address is now their login (Priority: P1)

The person who owns the **new** mailbox receives an email at that new address
confirming this address is now their Alkemio login. Because the recipient owns
this mailbox, the full new address is shown, along with a login link so they
can sign in immediately.

**Why this priority**: This closes the loop for the legitimate new owner and
makes the change actionable. Together with User Story 1 it forms the minimum
viable user-facing outcome of an email change.

**Independent Test**: Trigger an email change and confirm a single message
arrives at the new address confirming the login email, showing the full new
address, the change time, the initiator context, and a working login link.

**Acceptance Scenarios**:

1. **Given** a user whose email is changed, **When** the change completes,
   **Then** exactly one message is delivered to the new address confirming the
   address is now the account's login email.
2. **Given** the new-address message, **When** the recipient reads it, **Then**
   the full new address is shown and a login link is present.
3. **Given** the new-address message, **When** the recipient reads it, **Then**
   it shows the change time, the initiator context, and a recovery/disclaimer
   line.

---

### User Story 3 - Platform administrators are informed of the email change (Priority: P2)

Platform administrators receive an email so they are aware of email changes
across the platform and can assist if needed. The message names the affected
user and the initiator, shows the full old and new addresses (admins are
trusted recipients), and the change time. When the change is the result of a
drift-detected fault rather than a clean commit, the message reads as an action
item flagging that reconciliation is required.

**Why this priority**: This is operational awareness for platform staff. It is
valuable but not security-critical to the affected user, and the platform can
function without it in a first cut.

**Independent Test**: Trigger an email change and confirm every platform global
administrator receives an informational message; trigger a drift-detected
outcome and confirm the message renders the reconciliation-required variant.

**Acceptance Scenarios**:

1. **Given** an email change completes, **When** the notification is processed,
   **Then** every platform global administrator receives one informational
   message.
2. **Given** the global-admin message, **When** an admin reads it, **Then** it
   shows the subject and initiator display names, the full old and new
   addresses, and the change time.
3. **Given** a drift-detected outcome, **When** the global-admin message is
   rendered, **Then** it presents as a reconciliation-required action item
   rather than a routine confirmation.
4. **Given** an administrator has opted out of admin notifications, **When** the
   notification is processed, **Then** that administrator does not receive the
   message.

---

### Edge Cases

- **Old address is dead/abandoned**: The security signal is still sent to the
  raw old address; non-delivery there is acceptable and is not a platform error.
- **Self-initiated change**: When the user initiated the change themselves, the
  security-signal and new-address messages reflect "you" rather than "a platform
  administrator", and the global-admin message presents the initiator as the
  subject's own display name with an explicit self-initiation indicator (see
  FR-019).
- **Drift-detected outcome**: Only the global-admin message is affected — it
  switches to the reconciliation-required variant. Security-signal and
  new-address messages behave as for a normal commit.
- **Failed / rejected / rolled-back changes**: No email-change events are
  published for these outcomes, so no email-change emails are produced. No
  spurious delivery may occur.
- **Recipient on blacklist / unsubscribed**: Existing blacklist and unsubscribe
  filtering applies to all three messages unchanged.
- **Initiator is also a platform admin**: When the initiator is a different
  person from the subject, the initiator still receives the global-admin
  fan-out unless they have opted out; the message is not suppressed for that
  initiator.
- **Subject is also a platform admin**: The change's subject is always excluded
  from the global-admin fan-out for their own change — even when the subject is
  a platform global administrator, and even when the subject initiated the
  change themselves; the subject still receives the security-signal and
  new-address messages.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The notifications service MUST recognize and successfully handle
  the email-change security-signal event so that it is no longer treated as an
  unsupported event.
- **FR-002**: The notifications service MUST recognize and successfully handle
  the email-change new-address event so that it is no longer treated as an
  unsupported event.
- **FR-003**: The notifications service MUST recognize and successfully handle
  the email-change global-admin event so that it is no longer treated as an
  unsupported event.
- **FR-004**: For the security-signal event, the system MUST deliver to the old
  address carried in the event and MUST NOT deliver it anywhere else.
- **FR-005**: The security-signal message MUST state the login email was
  changed, show the change time in a human-readable form, show who initiated
  the change, show the new address only in masked form, and include recovery
  guidance directing the recipient to support.
- **FR-006**: The security-signal message MUST NOT contain the full new email
  address in any form.
- **FR-007**: For the new-address event, the system MUST deliver to the new
  address carried in the event and MUST NOT deliver it anywhere else.
- **FR-008**: The new-address message MUST state this address is now the
  account's Alkemio login email, show the change time, show who initiated the
  change, show the full new address, include a login link, and include a
  recovery/disclaimer line.
- **FR-009**: For the global-admin event, the system MUST deliver to the
  recipient set carried in the event payload (`recipients`). The server
  resolves this set to all platform global administrators (the same credential
  set targeted by the existing global-role-change notification), filtered by
  each administrator's admin-notification preference, and excludes the change's
  subject even when the subject is themselves a platform global administrator
  (the subject already receives the security-signal and new-address messages).
  The notifications service MUST NOT itself resolve recipients for this event —
  it consumes `payload.recipients` exactly as the existing global-role-change
  notification does.
- **FR-010**: The global-admin message MUST show the subject and initiator
  display names, the full old and new email addresses, and the change time.
- **FR-011**: The global-admin message MUST render a distinct
  reconciliation-required variant when the change outcome is drift-detected, and
  a routine confirmation variant when the outcome is a clean commit.
- **FR-012**: All three messages MUST respect the existing blacklist and
  unsubscribe filtering already applied to other notifications.
- **FR-013**: The shared notification-event library MUST expose the three
  email-change event payload types and be version-bumped additively, with no
  breaking changes to existing payload types.
- **FR-014**: The system MUST NOT produce any email-change email for change
  outcomes other than a committed or drift-detected change.
- **FR-015**: Existing notification flows MUST continue to function unchanged;
  in particular the global-role-change flow MUST be unaffected.
- **FR-016**: The email-change notifications MUST be delivered over email only
  in this release; no in-app or push channel is required.
- **FR-017**: The event-name values the service listens for MUST match the
  publisher's wire values exactly.
- **FR-018**: All three messages MUST render the change time in UTC, labelled
  explicitly as UTC (e.g. "20 May 2026, 14:32 UTC"), and MUST NOT render it in
  any other timezone or as a raw ISO 8601 string.
- **FR-019**: For a self-initiated change (`initiatorRole` = `'self'`), the
  global-admin message MUST present the initiator as the subject's display name
  with an explicit self-initiation indicator; when the event omits a separate
  initiator profile, the message MUST fall back to the subject profile for the
  initiator display.

### Key Entities *(include if feature involves data)*

- **Email-change security signal**: The notice sent to the old address.
  Attributes: recipient (old) address, change timestamp, initiator role, masked
  new address.
- **Email-change new-address notification**: The notice sent to the new
  address. Attributes: recipient (new) address, change timestamp, initiator
  role, full new address, login link.
- **Email-change global-admin notification**: The fan-out to platform
  administrators. Attributes: the server-resolved `recipients` list, subject
  profile (id, display name), full old and new emails, optional initiator
  profile, initiator role, change timestamp, change outcome (committed vs.
  drift-detected), and optionally the subject's membership footprint and global
  roles (carried on the event but, in this release, neither rendered in the
  message nor used for recipient resolution — see Assumptions).
- **Recipient set (global-admin)**: The set of platform global administrators,
  resolved by the server and carried in `payload.recipients`, filtered by the
  admin-notification preference and excluding the change's subject.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: After an email change completes, the notifications service
  produces zero "unsupported event" log entries for the three email-change
  event patterns.
- **SC-002**: After a successful email change, exactly one message is delivered
  to the old address and exactly one message is delivered to the new address.
- **SC-003**: 100% of platform global administrators who have not opted out of
  admin notifications — excluding the change's subject — receive the
  global-admin message for each email change.
- **SC-004**: In 100% of security-signal messages, the new address appears only
  in masked form and the full new address is absent.
- **SC-005**: For every drift-detected outcome, the global-admin message renders
  the reconciliation-required variant; for every clean commit it renders the
  routine variant.
- **SC-006**: Change outcomes other than committed or drift-detected produce
  zero email-change emails.
- **SC-007**: The global-role-change notification flow continues to deliver
  correctly after this feature ships (no regression).

## Assumptions

- The server side (spec 097) publishes the three events. For the global-admin
  event a server-side follow-up is required so the published payload carries
  the resolved `recipients` list (per the revised 097 §FR-016d / research.md
  §R8); the security-signal and new-address events publish unchanged.
- The three events are published over the existing RabbitMQ notifications
  exchange already used by other notification events.
- "Initiator context" is conveyed by the initiator role value carried on each
  event (the user themselves vs. a platform administrator); no additional
  initiator lookup is required for the security-signal and new-address
  messages.
- Recipient resolution for the global-admin event happens on the server,
  reusing the same platform global-administrator credential set and
  admin-notification preference filter as the global-role-change notification;
  the notifications service receives the resolved list in the event payload.
- English is the only language required (per parent feature scope).
- The subject membership footprint and global roles, if carried on the
  global-admin event, are NOT rendered in the message body and NOT used for
  recipient resolution in this release — the global-admin email-template
  payload omits them (data-model.md §4.3). Surfacing them in the message and
  broadening the recipient set are future, server-side work.
- A coordinated dependency bump of the shared library within this repository
  and a rebuild of the service image are part of delivering this feature.

## Dependencies

- Server spec 097 must be deployed/running for end-to-end validation, since it
  publishes the three events. The global-admin event additionally requires the
  server-side follow-up that resolves recipients into `payload.recipients` (see
  097 spec §FR-016d / research.md §R8).
- The shared notification-event library must be updated and version-bumped
  before the service can build against the new payload types.
