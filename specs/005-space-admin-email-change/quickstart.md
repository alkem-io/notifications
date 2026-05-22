# Quickstart: Space-Admin Email-Change Notification

**Branch**: `005-space-admin-email-change` | **Date**: 2026-05-20

Local validation that the notifications service handles the
`USER_EMAIL_CHANGE_SPACE_ADMIN_NOTIFICATION` event and delivers the right
message. Two paths:

- **Path A — direct RabbitMQ publish** (no server needed): validates the
  notifications service in isolation.
- **Path B — full end-to-end** (server running the publisher): validates the
  real publish → per-space fan-out → deliver chain. The server-side publisher is
  implemented (on the server's `097-change-user-email` branch), so Path B can be
  run against a local stack built from that branch.

## Prerequisites

```bash
# Build the library, then the service (monorepo: lib first)
cd lib && npm install && npm run build
cd ../service && npm install && npm run build

# Start mailslurper (local SMTP sink)
npm run start:services
```

- MailSlurper UI: `http://localhost:5051/mail`
- RabbitMQ management: `http://localhost:15672` → queue `alkemio-notifications`
- Run the service: `npm run start:dev`

## Path A — direct RabbitMQ publish

Publish a message to the `alkemio-notifications` queue with the **routing key**
set to the event name and the **body** set to the JSON payload. (Use the
RabbitMQ management UI "Publish message" panel, or any AMQP client.)

### Scenario 1 — Member email change, admin-initiated (US1)

Routing key: `USER_EMAIL_CHANGE_SPACE_ADMIN_NOTIFICATION`

```json
{
  "eventType": "USER_EMAIL_CHANGE_SPACE_ADMIN_NOTIFICATION",
  "triggeredBy": { "id": "u-init", "firstName": "Ada", "lastName": "Admin", "email": "ada@example.com", "type": "USER", "profile": { "displayName": "Ada Admin", "url": "" } },
  "recipients": [
    { "id": "u-a1", "firstName": "Bo", "lastName": "Admin", "email": "coadmin1@example.com", "type": "USER", "profile": { "displayName": "Bo Admin", "url": "http://localhost:3000/user/bo" } },
    { "id": "u-a2", "firstName": "Cy", "lastName": "Lead", "email": "coadmin2@example.com", "type": "USER", "profile": { "displayName": "Cy Lead", "url": "http://localhost:3000/user/cy" } }
  ],
  "platform": { "url": "http://localhost:3000" },
  "space": { "id": "s-1", "level": "0", "profile": { "displayName": "Climate Space", "url": "http://localhost:3000/climate" }, "adminURL": "http://localhost:3000/climate/settings" },
  "subjectProfileSummary": { "id": "u-subj", "displayName": "Sam Subject" },
  "oldEmail": "old.address@example.com",
  "newEmail": "new.address@example.com",
  "initiatorProfileSummary": { "id": "u-init", "displayName": "Ada Admin" },
  "initiatorRole": "platform_admin",
  "commitTimestampISO8601": "2026-05-20T14:32:00.000Z",
  "triggerOutcome": "COMMITTED"
}
```

**Expect**: one email per entry in `recipients` (`coadmin1@example.com` and
`coadmin2@example.com`); each names the subject `Sam Subject`, the space
`Climate Space`, the initiator `Ada Admin`, the full old and new addresses, and
`20 May 2026, 14:32 UTC`. No "unsupported event" warning in the log (SC-001).

### Scenario 2 — Self-initiated change

Re-publish with `"initiatorRole": "self"` and `initiatorProfileSummary` omitted.

**Expect**: the message shows the initiator as the subject's own display name
(`Sam Subject`) with the explicit self-initiation indicator.

### Scenario 3 — Drift-detected outcome

Re-publish with `"triggerOutcome": "DRIFT_DETECTED"`.

**Expect**: the email is delivered and reads **identically** to the `COMMITTED`
message — there is no reconciliation-required variant (FR-014).

### Scenario 4 — Subject is the space's only admin/lead (empty recipient set)

Re-publish with `"recipients": []`.

**Expect**: the service logs "No recipients found, aborting" and acks the
message; zero emails sent; no error (spec edge case).

### Scenario 5 — Blacklisted recipient (FR-011)

Blacklist one recipient: add `coadmin1@example.com` to the `email.blacklist`
notification-providers config setting (parsed by
`notification.blacklist.service.ts`) and restart the service. Re-publish
Scenario 1's message unchanged.

**Expect**: `coadmin1@example.com` receives nothing — the service log records a
blacklist filter for that address — while `coadmin2@example.com` still receives
the email. Confirms the existing blacklist / unsubscribe filtering (the same
`NotificationBlacklistService.filterRecipients` path) applies to the new event
unchanged (FR-011); it runs inside `buildAndSendEmailNotifications`, so no
feature code is involved.

## Path B — full end-to-end (server publisher)

Against a local stack with the server publisher running:

1. Register a throwaway user; make it a member of three spaces (any mix of
   member / lead / admin roles); note its Alkemio user id.
2. As a platform admin, change that user's login email.
3. Confirm the service log shows the event **handled** for each of the three
   spaces — zero "unsupported event" warnings (SC-001).
4. In MailSlurper: the admins and leads of each of the three spaces receive one
   message naming the correct space; the subject receives none for this
   notification (SC-002); the plain-membership space's admins/leads are notified
   exactly like the others (SC-003).
5. Confirm an admin who turned the new preference off receives nothing while
   other admins of the same space still do (SC-004).

> **Note**: Path B requires a local server stack built from the
> `097-change-user-email` branch, where the publisher of
> `USER_EMAIL_CHANGE_SPACE_ADMIN_NOTIFICATION` is implemented. Path A remains the
> quickest way to validate the notifications service in isolation.

## Regression check

Publish a `SPACE_ADMIN_COMMUNITY_APPLICATION` event (or exercise it via the
server) and confirm it still delivers correctly; likewise publish a 004
`USER_EMAIL_CHANGE_GLOBAL_ADMIN_NOTIFICATION` event. The space-community and
existing email-change flows must be unaffected (FR-015, SC-006).

## Acceptance mapping

| Check | Spec criterion |
|-------|----------------|
| No "unsupported event" log lines for the new event | SC-001 |
| Every admin/lead of every space the subject is a member of (minus subject, minus opted-out) receives it | SC-002 |
| A space's admins/leads are notified regardless of the subject's role in that space | SC-003 |
| An admin who turned the new preference off receives zero such notifications | SC-004 |
| Non-committed/drift outcomes produce zero such notifications | SC-005 |
| The 004 email-change notifications and other flows still deliver | SC-006 |
| A blacklisted recipient is filtered; other recipients still receive | FR-011 |
