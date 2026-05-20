# Quickstart: Email-Change Notification Events

**Branch**: `004-email-change-notifications` | **Date**: 2026-05-20

Local validation that the notifications service handles the three email-change
events and delivers the right message for each. Two paths:

- **Path A — direct RabbitMQ publish** (no server needed): validates the
  notifications service in isolation. Works for all three events.
- **Path B — full end-to-end** (server spec 097 running): validates the real
  publish→deliver chain. Events 1 & 2 work today; event 3 needs the server
  follow-up (research.md §R13).

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

### Scenario 1 — Security signal (US1)

Routing key: `USER_EMAIL_CHANGE_SECURITY_SIGNAL`

```json
{
  "recipientEmail": "old.address@example.com",
  "commitTimestampISO8601": "2026-05-20T14:32:00.000Z",
  "initiatorRole": "platform_admin",
  "newEmailMasked": "n***@e***.com"
}
```

**Expect**: exactly one email at `old.address@example.com`; states the login
email changed; shows `20 May 2026, 14:32 UTC`; says "a platform administrator";
shows `n***@e***.com`; includes recovery guidance. The full new address is
absent. No "unsupported event" warning in the log.

Re-run with `"initiatorRole": "self"` → the message says "you" instead.

### Scenario 2 — New-address notification (US2)

Routing key: `USER_EMAIL_CHANGE_NEW_ADDRESS_NOTIFICATION`

```json
{
  "recipientEmail": "new.address@example.com",
  "commitTimestampISO8601": "2026-05-20T14:32:00.000Z",
  "initiatorRole": "platform_admin",
  "newEmailFull": "new.address@example.com",
  "loginUrl": "http://localhost:3000/login"
}
```

**Expect**: exactly one email at `new.address@example.com`; confirms this is now
the account's login email; shows the full address, the change time, the
initiator context, a working login link, and a recovery/disclaimer line.

### Scenario 3 — Global-admin notification (US3)

Routing key: `USER_EMAIL_CHANGE_GLOBAL_ADMIN_NOTIFICATION`

```json
{
  "eventType": "USER_EMAIL_CHANGE_GLOBAL_ADMIN_NOTIFICATION",
  "triggeredBy": { "id": "u-init", "firstName": "Ada", "lastName": "Admin", "email": "ada@example.com", "type": "USER", "profile": { "displayName": "Ada Admin", "url": "" } },
  "recipients": [
    { "id": "u-a1", "firstName": "Glen", "lastName": "Global", "email": "admin1@example.com", "type": "USER", "profile": { "displayName": "Glen Global", "url": "" } }
  ],
  "platform": { "url": "http://localhost:3000" },
  "subjectProfileSummary": { "id": "u-subj", "displayName": "Sam Subject" },
  "oldEmail": "old.address@example.com",
  "newEmail": "new.address@example.com",
  "initiatorProfileSummary": { "id": "u-init", "displayName": "Ada Admin" },
  "initiatorRole": "platform_admin",
  "commitTimestampISO8601": "2026-05-20T14:32:00.000Z",
  "triggerOutcome": "COMMITTED"
}
```

**Expect**: one email per entry in `recipients` (`admin1@example.com` here);
shows subject + initiator display names, full old and new emails, and the
change time.

Re-run with `"triggerOutcome": "DRIFT_DETECTED"` → the message renders the
reconciliation-required variant.

Re-run with `initiatorRole: "self"` and `initiatorProfileSummary` omitted → the
initiator shows the subject's display name with the self-initiation indicator
(FR-019).

## Path B — full end-to-end (server spec 097)

Against a local stack with server spec 097 running:

1. Register a throwaway user; note its Alkemio user id.
2. As a platform admin, run the `adminUserEmailChange` mutation for that user.
3. Confirm the service log shows all three events **handled** — zero
   "unsupported event" warnings (SC-001).
4. In MailSlurper: exactly one message at the OLD address (masked new email)
   and exactly one at the NEW address (full new email + login link) (SC-002).
5. Confirm the global-admin message reached a platform admin other than the
   initiator, and that the subject did **not** receive it (SC-003).
6. Trigger a drift-detected outcome → the global-admin message renders the
   reconciliation-required variant (SC-005).

> **Event 3 caveat**: step 5/6 require the server follow-up that publishes
> `USER_EMAIL_CHANGE_GLOBAL_ADMIN_NOTIFICATION` with a resolved `recipients`
> array (research.md §R13). Until it lands, validate event 3 via Path A.

## Regression check

Publish a `PLATFORM_ADMIN_GLOBAL_ROLE_CHANGED` event (or exercise it via the
server) and confirm it still delivers correctly — the global-role-change flow
must be unaffected (FR-015, SC-007).

## Acceptance mapping

| Check | Spec criterion |
|-------|----------------|
| No "unsupported event" log lines | SC-001 |
| One email to OLD, one to NEW | SC-002 |
| All non-opted-out global admins (minus subject) receive event 3 | SC-003 |
| Security-signal shows only the masked address | SC-004 |
| Drift → reconciliation variant; commit → routine variant | SC-005 |
| Non-committed/drift outcomes produce zero emails | SC-006 |
| Global-role-change still works | SC-007 |
