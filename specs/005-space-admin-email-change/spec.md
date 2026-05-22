# Feature Specification: Space-Admin Email-Change Notification

**Feature Branch**: `005-space-admin-email-change`
**Created**: 2026-05-20
**Status**: Ready for Implementation
**Input**: User description: "Notify the admins and leads of each space a user belongs to when that user's login email is changed — a sibling of the existing email-change notifications, gated by a new opt-out toggle in the Space settings group."

## Clarifications

### Session 2026-05-20

- Q: Should the publisher emit one event per qualifying space, or a single event carrying all spaces (so the notifications service fans out per space)? → A: One event per qualifying space, modelled on the existing space-community notifications (e.g. the community-application notification) rather than on the global-admin email-change notification — each event extends the shared space-notification payload, carrying that one space and a server-resolved recipient set of that space's admins/leads.

### Session 2026-05-22

- Q: Must the affected user hold an admin or lead role in a space for that space's administrators to be notified, or does a plain membership qualify? → A: A plain membership qualifies. The notification fires for every space the affected user is a member of — whether they are a plain member, a lead, or an admin of that space. Only the *recipient* must be a space admin or lead; the *subject*'s own role in the space is irrelevant.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Space admins learn that a member's login email changed (Priority: P1)

When a user's login email is changed, the administrators and leads of every space
that user belongs to are informed. The people who run a space are responsible for
the community within it; when a member of that community has their login identity
changed — especially by someone else — the space's admins and leads should find
out, so an unexpected or unauthorized change to one of their members is noticed by
people connected to that space rather than only by distant platform staff.

**Why this priority**: This is the whole value of the feature. A space's admins
and leads are the people closest to its members and the most likely to recognize
that a change to a member's account is wrong. Without it, a change to a space
member's login is visible only to platform-wide administrators. It delivers value
on its own.

**Independent Test**: Change the login email of a user who is a member of at
least one space, and confirm the admins and leads of that space each receive a
message naming the affected user, the space, who made the change, and when.

**Acceptance Scenarios**:

1. **Given** a user who is a member of Space S, **When** that user's login email
   is changed, **Then** every admin and lead of Space S receives one message
   stating the user's login email was changed.
2. **Given** the affected user is a member of several spaces, **When** the email
   is changed, **Then** the admins and leads of each of those spaces are notified
   and each message names the space it concerns.
3. **Given** a space the affected user belongs to, **When** the change occurs,
   **Then** the message names the affected user, the space, who initiated the
   change, and when it happened.
4. **Given** the affected user holds only a plain membership of Space S (no admin
   or lead role), **When** the change occurs, **Then** the admins and leads of
   Space S are still notified — a plain membership qualifies a space exactly as
   an admin or lead role does.
5. **Given** the affected user is themselves an admin or lead of a space, **When**
   the change occurs, **Then** that user does not receive this notification for
   their own change.

---

### User Story 2 - A space admin opts out of member email-change notifications (Priority: P2)

A space administrator who does not want to be told about their members' email
changes can turn the notification off in their personal notification settings,
in the same Space group where they manage their other space-related preferences.

**Why this priority**: Notification fatigue is real — an admin who runs busy
spaces could receive a number of these. A single, discoverable opt-out keeps the
feature from becoming noise. It is valuable, but the feature delivers its core
worth (User Story 1) without it.

**Independent Test**: As a space admin, turn the new preference off, then trigger
an email change for a member of a space they administer, and confirm no message
is delivered to the opted-out admin while other admins still receive it.

**Acceptance Scenarios**:

1. **Given** a space admin who has left the new preference on (default), **When**
   a member's email is changed, **Then** they receive the notification.
2. **Given** a space admin who has turned the new preference off, **When** a
   member's email is changed, **Then** they do not receive the notification, and
   other admins are unaffected.
3. **Given** the notification-settings screen, **When** a space admin views the
   Space group, **Then** the new preference appears there as a labelled toggle
   alongside the other space notifications.

---

### Edge Cases

- **Affected user is a member of no spaces**: this notification produces nothing
  — the security-signal, new-address, and global-admin email-change notifications
  still fire as before.
- **A space whose only admin/lead is the affected user**: after excluding the
  subject there is no admin or lead left to notify for that space, so no
  notification is produced for it.
- **A space admin is also the initiator of the change**: they still receive the
  notification (not suppressed) unless they have opted out — only the *subject*
  of the change is excluded.
- **Self-initiated change**: the message reflects that the user changed it
  themselves rather than an administrator doing it on their behalf.
- **Drift-detected outcome**: the email change still committed, so the
  notification is still sent; it carries the same routine message — the
  reconciliation-required framing is reserved for platform staff and is out of
  scope here.
- **Failed / rejected / rolled-back change**: no email-change events are
  published, so no space-admin notification is produced.
- **Recipient on blacklist / unsubscribed**: existing blacklist and unsubscribe
  filtering applies unchanged.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The notifications service MUST recognize and successfully handle a
  new space-admin email-change event so that it is not treated as an unsupported
  event.
- **FR-002**: The system MUST deliver the notification to the administrators
  (admin and lead roles) of every space of which the affected user is a member,
  regardless of the role the affected user holds in that space.
- **FR-003**: The affected user's own role in a space MUST NOT affect whether
  that space's administrators are notified — a plain membership qualifies a space
  exactly as an admin or lead role does.
- **FR-004**: The system MUST exclude the affected user (the subject of the
  change) from receiving this notification, even where the subject is themselves
  an admin or lead of the space.
- **FR-005**: The system MUST send one message per space the affected user is a
  member of, and each message MUST identify the space it concerns.
- **FR-006**: Each message MUST state that the user's login email was changed,
  and MUST show the affected user's name, the space concerned, who initiated the
  change (the user themselves vs. an administrator), and the change time.
- **FR-007**: The message MUST show the affected user's full old and new email
  addresses, consistent with how the platform global-admin email-change
  notification presents them — the recipients are the administrators and leads
  of a space the affected user belongs to and are trusted with that detail.
- **FR-008**: The change time MUST be rendered in UTC, explicitly labelled as
  UTC, and MUST NOT be shown as a raw machine timestamp.
- **FR-009**: The notification MUST be gated by a new per-user notification
  preference, presented in the Space group of the notification settings;
  administrators who have turned this preference off MUST NOT receive it.
- **FR-010**: The new preference's default state MUST be consistent with the
  existing global-admin email-change notification preference.
- **FR-011**: All messages MUST respect the existing blacklist and unsubscribe
  filtering already applied to other notifications.
- **FR-012**: The notification MUST be delivered over email only in this
  release; no in-app or push channel is required.
- **FR-013**: The system MUST produce this notification only for committed or
  drift-detected change outcomes, and MUST NOT produce it for any other outcome.
- **FR-014**: A drift-detected outcome MUST still produce this notification,
  using the same routine message as a clean commit — there is no separate
  reconciliation-required variant.
- **FR-015**: Existing notification flows — including the three existing
  email-change notifications (security-signal, new-address, global-admin) — MUST
  continue to function unchanged.
- **FR-016**: The event-name value the service listens for MUST match the
  publisher's wire value exactly.

### Key Entities *(include if feature involves data)*

- **Space-admin email-change notification**: One per-space message sent to a
  space's administrators. The publisher emits one event per space the affected
  user is a member of, modelled on the existing space-community notifications
  (e.g. the community-application notification) — each event extends the shared
  space-notification payload and carries exactly one space — not on the
  global-admin email-change notification. Attributes: the affected user, the one
  space concerned, the initiator, the change time, the change outcome.
- **Recipient set (per space)**: The admins and leads of the single space carried
  on the event — a space of which the subject is a member — with the subject
  excluded. Resolved by the publisher and carried on the event as its flat
  recipient set; the notifications service neither resolves recipients nor fans
  out across spaces.
- **Space-admin email-change preference**: The new per-user opt-out toggle, shown
  in the Space group of the notification-settings UI.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: After an email change, the notifications service produces zero
  "unsupported event" log entries for the new space-admin email-change event.
- **SC-002**: 100% of the admins and leads of every space the subject is a
  member of — excluding the subject and anyone who has opted out — receive the
  notification.
- **SC-003**: A space's admins and leads are notified of a member's email change
  regardless of that member's role in the space — a plain member, a lead, and an
  admin all trigger the notification identically.
- **SC-004**: An administrator who has turned the new preference off receives
  zero such notifications.
- **SC-005**: Change outcomes other than committed or drift-detected produce
  zero such notifications.
- **SC-006**: The three existing email-change notifications and all other
  notification flows continue to deliver correctly after this feature ships
  (no regression).

## Assumptions

- The server (the email-change publisher) will be extended to publish one event
  per space the subject is a member of, each carrying a server-resolved recipient
  set for that space — recipient resolution does not happen in the notifications
  service. This mirrors the existing space-community notifications (e.g. the
  community-application notification): each event extends the shared
  space-notification payload, carrying a single space and that space's recipient
  set. It does NOT follow the global-admin email-change shape (one event, a flat
  platform-wide recipient set, a membership footprint).
- The server resolves which spaces qualify — every space the subject is a member
  of — and emits one event per such space; the notifications service neither
  derives qualifying spaces nor fans out across them, handling each per-space
  event independently.
- "Space administrator" (the recipient role) refers to the space admin and space
  lead roles. The affected user (the subject) qualifies a space by a membership
  of any kind — a plain member, a lead, or an admin of that space — their role
  there does not matter.
- The new preference defaults to on (an opt-out model), consistent with the
  global-admin email-change preference.
- English is the only language required; email is the only channel this release.
- The notification fires for both committed and drift-detected outcomes with a
  single routine message; the drift reconciliation workflow remains with
  platform staff and is out of scope.
- The new preference is shown in the Space group of the notification-settings
  UI as an administrator-level toggle, alongside the existing space
  notifications.

## Dependencies

- Server-side work to publish one event per space the subject is a member of,
  resolve each space's administrator (admin/lead) recipients, and store the new
  notification preference.
- Client-side work to surface the new preference toggle in the
  notification-settings UI.
- The existing email-change notification family (the three notifications already
  delivered) — this feature is a sibling addition to that family.
