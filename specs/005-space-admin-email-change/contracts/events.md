# Event Contracts: Space-Admin Email-Change Notification

**Branch**: `005-space-admin-email-change` | **Date**: 2026-05-20

The notifications service exposes **no HTTP/GraphQL API** for this feature — it
*consumes* one RabbitMQ event. This is the wire contract. Producer: the
`alkemio-server` (`NotificationExternalAdapter`). Consumer: `alkemio-notifications`
(`AppController` `@EventPattern` handler).

Transport: the existing RabbitMQ notifications exchange. The **routing key** is
the `NotificationEvent` value; the **message body** is the JSON payload below.

---

## Contract — `USER_EMAIL_CHANGE_SPACE_ADMIN_NOTIFICATION`

- **Direction**: server → notifications service
- **Routing key**: `USER_EMAIL_CHANGE_SPACE_ADMIN_NOTIFICATION` (research.md §R2)
- **Envelope**: **`NotificationEventPayloadSpace`** (`BaseEventPayload` +
  `space`) — published via the server's `buildBaseEventPayload`, the same shape
  family as `SPACE_ADMIN_COMMUNITY_APPLICATION`
- **Cardinality**: **one event per qualifying space**. If the subject is a
  member of N spaces, the server publishes N events, each carrying one `space`
  and that space's own resolved `recipients` (FR-005)
- **Delivery target**: `recipients[]` — the server-resolved admin/lead set of
  the carried `space`, with the change's subject excluded (FR-004) and opted-out
  admins already filtered out (FR-009)

```ts
interface UserEmailChangeSpaceAdminNotificationPayload extends NotificationEventPayloadSpace {
  // BaseEventPayload: eventType, triggeredBy, recipients: UserPayload[], platform
  // NotificationEventPayloadSpace adds: space: SpacePayload
  subjectProfileSummary: { id: string; displayName: string };
  oldEmail: string;                // full
  newEmail: string;                // full
  initiatorProfileSummary?: { id: string; displayName: string };
  initiatorRole: 'self' | 'platform_admin';
  commitTimestampISO8601: string;  // ISO 8601 UTC
  triggerOutcome: 'COMMITTED' | 'DRIFT_DETECTED';
}
```

**Producer obligations**:

- Emit **one event per space** of which the subject is a member — a plain
  member, a lead, or an admin of the space all qualify equally (FR-002, FR-003).
- Resolve `recipients` to that space's admin + lead role-holders, **excluding
  the subject** (FR-004) and **excluding admins who opted out** of the new
  preference (FR-009).
- Populate `space` for the one space concerned (`id`, `level`, `profile`,
  `adminURL`).
- Publish only for the `COMMITTED` and `DRIFT_DETECTED` outcomes (FR-013).
- `initiatorProfileSummary` is omitted when the change is self-initiated
  (`initiatorRole === 'self'`).

**Consumer obligations**:

- Consume `recipients[]` as-is — **no** recipient resolution and **no** fan-out
  in the service (research.md §R4).
- Render one email per recipient naming the subject, the space, the initiator,
  the full old and new addresses, and the UTC-formatted change time (FR-006,
  FR-007, FR-008).
- Render the **same routine message** for `COMMITTED` and `DRIFT_DETECTED` —
  no drift variant (FR-014).
- Apply the existing blacklist / unsubscribe filtering (FR-011) — automatic, via
  `buildAndSendEmailNotifications`.

---

## Outcomes that produce NO event

A drift-detected change has still **committed** the new email, so the contract
fires for both `COMMITTED` and `DRIFT_DETECTED` — with the same routine message
(FR-014). Rejected, rolled-back, drift-resolved and `*_failed` outcomes publish
**nothing**; the notifications service therefore produces zero space-admin
email-change emails for them (FR-013, SC-005). No consumer-side guard is
required — absence of an event is the contract.

A space whose only admin/lead is the subject produces an event with an **empty**
`recipients` after exclusion — the service logs "No recipients" and acks without
sending (spec edge case; existing `buildAndSendEmailNotifications` behaviour).

---

## Consumer routing summary

| Routing key | `@EventPattern` handler | Normalization | Builder + template |
|-------------|------------------------|---------------|--------------------|
| `USER_EMAIL_CHANGE_SPACE_ADMIN_NOTIFICATION` | new — thin pass-through | none (already `NotificationEventPayloadSpace`) | `createEmailTemplatePayloadSpaceAdminUserEmailChange` → `space.admin.user.email.change` |

See [research.md §R4](./research.md) for the pass-through rationale and
[data-model.md](./data-model.md) for the full field tables.
