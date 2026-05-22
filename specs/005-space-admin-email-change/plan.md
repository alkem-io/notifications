# Implementation Plan: Space-Admin Email-Change Notification

**Branch**: `005-space-admin-email-change` | **Date**: 2026-05-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-space-admin-email-change/spec.md`

## Summary

When a user's login email is changed, the server publishes **one event per
qualifying space** — every space that user is a member of (a plain member, a
lead, or an admin of the space all qualify equally).
Each event extends the shared space-notification payload (`NotificationEventPayloadSpace`),
carries that one space, and carries a **server-resolved** `recipients` array (that
space's admins and leads, with the subject excluded and opted-out admins already
filtered out). The `alkemio-notifications` service does not yet recognise this
event and would negative-ack it, so no email is delivered.

This feature is a **sibling of the existing email-change family** (004 —
security-signal, new-address, global-admin) but is **structurally modelled on the
space-community notifications** (e.g. `SPACE_ADMIN_COMMUNITY_APPLICATION`): a
per-space event extending `NotificationEventPayloadSpace`, not a single
platform-wide fan-out. It adds one event payload type to
`@alkemio/notifications-lib` and wires the service to handle it along the
documented "add a notification" recipe: `@EventPattern` handler → payload builder
→ Nunjucks template → email.

**Technical approach** (from [research.md](./research.md)):

- The event is published **with** the full `BaseEventPayload` envelope (it extends
  `NotificationEventPayloadSpace`), so its `@EventPattern` handler is a **thin
  pass-through** to `processNotificationEvent` — exactly like
  `SpaceAdminCommunityApplication` and `UserEmailChangeGlobalAdminNotification`.
  **No** raw-payload normalization is needed (unlike 004 events 1 & 2).
- The notifications service neither resolves recipients nor fans out across spaces:
  the server emits one event per space, each carrying its own resolved
  `recipients`. The service handles each event independently.
- The new opt-out preference (FR-009/FR-010) is **out of scope for this repo** —
  the server filters recipients by the preference before publishing, and the
  client surfaces the toggle. The notifications service consumes `recipients`
  as-is. See [research.md §R7](./research.md).
- One switch case each in `createEmailPayloadForEvent` and
  `getEmailTemplateToUseForEvent`; one builder method; one template; one
  `@EventPattern` handler; one `NotificationEvent` enum member.
- The email-template payload extends `BaseSpaceEmailPayload` so the message names
  the space (FR-005/FR-006); email-change fields mirror the global-admin sibling.
- `initiatorRole` wire values are lowercase (`'self'` / `'platform_admin'`);
  the change timestamp renders in UTC with an explicit label via the existing
  `formatChangeTimestampUTC` helper. The template carries **no** drift variant —
  committed and drift-detected use one routine message (FR-014).

## Technical Context

**Language/Version**: TypeScript 5.9 (`service/`), TypeScript 5.8 (`lib/`); Node.js 22.x (service, Volta-pinned 22.16.0), Node.js 20.x (lib)
**Primary Dependencies**: NestJS 11, `@nestjs/microservices` (RabbitMQ / amqplib), notifme-sdk, Nunjucks, `@alkemio/notifications-lib`
**Storage**: N/A — the service is a stateless RabbitMQ consumer; no persistence
**Testing**: Jest (`service/`, `npm test`); `lib/` has no test runner — type-checked via `tsc --noEmit`
**Target Platform**: Linux server, Docker container; RabbitMQ consumer microservice
**Project Type**: Two-package monorepo — `lib/` (shared types) + `service/` (NestJS microservice)
**Performance Goals**: N/A — email changes are low-frequency; per-space fan-out happens server-side and adds no new throughput/latency concern in this service
**Constraints**: Email channel only this release (FR-012); additive library change, no breaking payload changes (FR-015); existing notification flows — including the three 004 email-change notifications — MUST NOT regress (FR-015 / SC-006)
**Scale/Scope**: 1 event → 1 lib payload type, 1 service email-template payload, 1 Nunjucks template, 1 `@EventPattern` handler, 1 `NotificationEvent` enum member, 1 switch case × 2. Small, well-bounded; no new infrastructure. The preference (FR-009/FR-010) is upstream-only.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution (`.specify/memory/constitution.md`) is an unpopulated
template — no principles, sections, or governance rules are ratified. There are
therefore no constitutional gates to evaluate.

- **Initial check (pre-Phase 0)**: PASS (vacuous — no gates defined).
- **Post-design re-check (post-Phase 1)**: PASS — the design adds no new
  projects, services, or infrastructure; it extends one existing library and one
  existing service along their established patterns, and reuses the generic
  send/ack/nack engine unchanged.

No `/speckit.plan` ERROR condition is triggered: there are no gate violations and
all NEEDS CLARIFICATION items are resolved in [research.md](./research.md).

## Project Structure

### Documentation (this feature)

```text
specs/005-space-admin-email-change/
├── plan.md              # This file
├── research.md          # Phase 0 — decisions R1–R10
├── data-model.md        # Phase 1 — payload types (wire / email-template)
├── quickstart.md        # Phase 1 — local validation (RabbitMQ + MailSlurper)
├── contracts/
│   └── events.md        # Phase 1 — the RabbitMQ event contract
├── checklists/
│   └── requirements.md  # pre-existing — spec quality checklist
├── spec.md              # feature specification
└── tasks.md             # Phase 2 — created by /speckit.tasks (NOT by /speckit.plan)
```

### Source Code (repository root)

```text
lib/                                                 # @alkemio/notifications-lib
├── src/dto/email-change/
│   └── notification.event.payload.user.email.change.space.admin.ts   # NEW
├── src/dto/index.ts                                                  # MODIFIED — export the new type
└── package.json                                                      # MODIFIED — additive minor bump (0.15.0 → 0.16.0)

service/                                             # alkemio-notifications
├── src/app.controller.ts                                             # MODIFIED — 1 @EventPattern handler (thin pass-through)
├── src/generated/alkemio-schema.ts                                   # MODIFIED — 1 NotificationEvent member
├── src/services/notification/
│   ├── notification.service.ts                                       # MODIFIED — 1 case in each of the two switches
│   ├── notification.service.spec.ts                                  # MODIFIED — unit coverage for the new event
│   ├── notification.email.payload.builder.service.ts                 # MODIFIED — 1 builder method
│   └── email-template-payload/
│       ├── space.admin.user.email.change.email.payload.ts            # NEW
│       └── index.ts                                                  # MODIFIED — export the new payload
├── src/email-templates/
│   └── space.admin.user.email.change.js                              # NEW
└── package.json                                                      # MODIFIED — bump @alkemio/notifications-lib dep (0.15.0 → 0.16.0)
```

**Structure Decision**: No new structure. The feature extends the existing
two-package monorepo along its established conventions — the payload DTO joins
the 004 family in `lib/src/dto/email-change/`; the email-template payload,
template, builder method, switch cases, and `@EventPattern` handler land in
`service/` exactly as for every other notification. The new lib type extends
`NotificationEventPayloadSpace` (the shared space-notification payload), and the
new email-template payload extends `BaseSpaceEmailPayload`, so the message is
space-scoped (FR-005/FR-006). Because the event arrives with a full
`BaseEventPayload` envelope and a server-resolved `recipients` array, the handler
is a pass-through and the generic `buildAndSendEmailNotifications` engine is
untouched — protecting the no-regression requirement (FR-015 / SC-006).

## Complexity Tracking

No constitutional violations (no ratified constitution). No new projects,
services, abstractions, or infrastructure are introduced. The feature is a
single notification added along the documented `CLAUDE.md` recipe; the per-space
fan-out and recipient resolution are server-side, so this service gains no new
control flow. Nothing to justify here.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| _none_ | — | — |

## Dependencies & sequencing notes

- **Library before service**: the `@alkemio/notifications-lib` payload type and
  version bump (0.15.0 → 0.16.0) must land first; the service then builds against
  the new type and bumps its dependency in lockstep.
- **Server publisher**: the server-side publisher is implemented (on the server's
  `097-change-user-email` branch) — it publishes one
  `USER_EMAIL_CHANGE_SPACE_ADMIN_NOTIFICATION` event per space the subject is a
  member of, with a server-resolved `recipients` array. End-to-end (Path B)
  validation can run against it; the service-side handler, builder, template, and
  unit tests are also validatable in isolation via direct RabbitMQ publish
  (Path A — [quickstart.md](./quickstart.md)).
- **`NotificationEvent` enum**: the one member was added manually (research.md
  §R3). The wire value (FR-016) `USER_EMAIL_CHANGE_SPACE_ADMIN_NOTIFICATION` is
  **confirmed** — the server's `NotificationEvent` enum registers exactly that
  literal. `npm run codegen` against the server can re-confirm it.
- **Out-of-repo work**: the server-side publisher is implemented (on the server's
  `097-change-user-email` branch) — it emits one event per space the subject is a
  member of, resolves each space's admin/lead recipients filtered by the new
  opt-out preference, and stores the preference. Still outstanding: the client
  surfaces the toggle in the Space group of the notification-settings UI.

## Next step

Run `/speckit.tasks` to generate `tasks.md` — the dependency-ordered task
breakdown — from this plan and the Phase 1 artifacts.
