# Event Contracts: Email-Change Notification Events

**Branch**: `004-email-change-notifications` | **Date**: 2026-05-20

The notifications service exposes **no HTTP/GraphQL API** for this feature — it
*consumes* three RabbitMQ events. These are the wire contracts. Producer: the
`alkemio-server` (`NotificationExternalAdapter`). Consumer: `alkemio-notifications`
(`AppController` `@EventPattern` handlers).

Transport: the existing RabbitMQ notifications exchange. The **routing key** is
the `NotificationEvent` value; the **message body** is the JSON payload below.

---

## Contract 1 — `USER_EMAIL_CHANGE_SECURITY_SIGNAL`

- **Direction**: server → notifications service
- **Routing key**: `USER_EMAIL_CHANGE_SECURITY_SIGNAL`
- **Envelope**: raw — **no** `BaseEventPayload` wrapper
- **Delivery target**: `recipientEmail` (the OLD address), and nowhere else (FR-004)

```ts
interface UserEmailChangeSecuritySignalPayload {
  recipientEmail: string;          // OLD address
  commitTimestampISO8601: string;  // ISO 8601 UTC
  initiatorRole: 'self' | 'platform_admin';
  newEmailMasked: string;          // e.g. "e***@c***.bg" — render verbatim
}
```

**Consumer obligations**: deliver to `recipientEmail` only; render `newEmailMasked`
verbatim; the full new address MUST NOT appear (FR-006). Subject to blacklist /
unsubscribe filtering (FR-012).

---

## Contract 2 — `USER_EMAIL_CHANGE_NEW_ADDRESS_NOTIFICATION`

- **Direction**: server → notifications service
- **Routing key**: `USER_EMAIL_CHANGE_NEW_ADDRESS_NOTIFICATION`
- **Envelope**: raw — **no** `BaseEventPayload` wrapper
- **Delivery target**: `recipientEmail` (the NEW address), and nowhere else (FR-007)

```ts
interface UserEmailChangeNewAddressNotificationPayload {
  recipientEmail: string;          // NEW address
  commitTimestampISO8601: string;  // ISO 8601 UTC
  initiatorRole: 'self' | 'platform_admin';
  newEmailFull: string;            // full new address
  loginUrl: string;                // client-web login deep link
}
```

**Consumer obligations**: deliver to `recipientEmail` only; show `newEmailFull`
and `loginUrl`; subject to blacklist / unsubscribe filtering.

---

## Contract 3 — `USER_EMAIL_CHANGE_GLOBAL_ADMIN_NOTIFICATION`

- **Direction**: server → notifications service
- **Routing key**: `USER_EMAIL_CHANGE_GLOBAL_ADMIN_NOTIFICATION`
- **Envelope**: **`BaseEventPayload`** — published via the server's
  `buildBaseEventPayload`, identical to `PLATFORM_ADMIN_GLOBAL_ROLE_CHANGED`
- **Delivery target**: `recipients[]` — the server-resolved platform-admin set,
  with the change's subject excluded (FR-009)

```ts
interface UserEmailChangeGlobalAdminNotificationPayload extends BaseEventPayload {
  // BaseEventPayload: eventType, triggeredBy, recipients: UserPayload[], platform
  subjectProfileSummary: { id: string; displayName: string };
  oldEmail: string;                // full
  newEmail: string;                // full
  initiatorProfileSummary?: { id: string; displayName: string };
  initiatorRole: 'self' | 'platform_admin';
  commitTimestampISO8601: string;  // ISO 8601 UTC
  triggerOutcome: 'COMMITTED' | 'DRIFT_DETECTED';
  subjectMemberships?: {           // optional — informational context only
    spaces: { spaceId: string; level: string; roles: string[] }[];
    organizations: { organizationId: string; roles: string[] }[];
  };
  subjectGlobalRoles?: string[];   // optional — informational context only
}
```

**Producer obligation (server follow-up — research.md §R13)**: the server MUST
resolve `recipients` (global-admin credential set, filtered by the
admin-notification setting, subject excluded) and publish via `buildBaseEventPayload`.
Until that follow-up lands, the server still publishes the older
footprint-only shape and Contract 3 cannot be validated end-to-end.

**Consumer obligations**: consume `recipients[]` as-is (no recipient resolution
in the service); render the `COMMITTED` vs `DRIFT_DETECTED` variant (FR-011);
apply blacklist / unsubscribe filtering.

---

## Outcomes that produce NO event

A drift-detected change has still **committed** the new email — so all three
contracts fire for both the `COMMITTED` and `DRIFT_DETECTED` outcomes. The
security-signal and new-address messages (Contracts 1 & 2) are sent as for a
normal commit; only the global-admin message (Contract 3) reflects the drift,
via its `triggerOutcome` variant (spec.md "Drift-detected outcome" edge case,
FR-011/FR-014). Rejected, rolled-back, drift-resolved and `*_failed` outcomes
publish **nothing** — the notifications service therefore produces zero
email-change emails for them (FR-014, SC-006). No consumer-side guard is
required; absence of an event is the contract.

---

## Consumer routing summary

| Routing key | `@EventPattern` handler | Normalization | Builder + template |
|-------------|------------------------|---------------|--------------------|
| `USER_EMAIL_CHANGE_SECURITY_SIGNAL` | new | inject envelope + synthesize 1 recipient | `…SecuritySignal` → `user.email.change.security.signal` |
| `USER_EMAIL_CHANGE_NEW_ADDRESS_NOTIFICATION` | new | inject envelope + synthesize 1 recipient | `…NewAddress` → `user.email.change.new.address` |
| `USER_EMAIL_CHANGE_GLOBAL_ADMIN_NOTIFICATION` | new | none (already `BaseEventPayload`) | `…PlatformAdminUserEmailChange` → `platform.admin.user.email.change` |

See [research.md §R5](../research.md) for the normalization rationale and
[data-model.md](../data-model.md) for the full field tables.
