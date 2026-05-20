# Implementation Plan: Email-Change Notification Events

**Branch**: `004-email-change-notifications` | **Date**: 2026-05-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-email-change-notifications/spec.md`

## Summary

Server spec 097 publishes three new RabbitMQ events on an admin email change —
`USER_EMAIL_CHANGE_SECURITY_SIGNAL` (to the old address),
`USER_EMAIL_CHANGE_NEW_ADDRESS_NOTIFICATION` (to the new address), and
`USER_EMAIL_CHANGE_GLOBAL_ADMIN_NOTIFICATION` (fan-out to platform admins). The
`alkemio-notifications` service does not recognise them and negative-acks each,
so no email is delivered. This feature adds the three event payload types to
`@alkemio/notifications-lib` and wires the service to handle each event:
`@EventPattern` handler → payload builder → Nunjucks template → email.

**Technical approach** (from [research.md](./research.md)):

- **Events 1 & 2 publish raw** — no `eventType` / `recipients` / `platform`
  envelope. Each handler **normalizes** the raw payload (injects the envelope,
  synthesizes a one-element recipient list from `recipientEmail`), then reuses
  the existing `processNotificationEvent` → `buildAndSendEmailNotifications`
  pipeline unchanged.
- **Event 3 mirrors `PLATFORM_ADMIN_GLOBAL_ROLE_CHANGED`** — its payload already
  carries a server-resolved `recipients` array (097 §R8, revised to server-side
  resolution). The handler is a thin pass-through; no normalization.
- Three switch cases each in `createEmailPayloadForEvent` and
  `getEmailTemplateToUseForEvent`; three builder methods; three templates —
  exactly the "add a notification" recipe in `CLAUDE.md`.
- `initiatorRole` wire values are lowercase (`'self'` / `'platform_admin'`);
  timestamps render in UTC with an explicit label.

## Technical Context

**Language/Version**: TypeScript 5.9 (`service/`), TypeScript 5.8 (`lib/`); Node.js 22.x (service, Volta-pinned 22.16.0), Node.js 20.x (lib)
**Primary Dependencies**: NestJS 11, `@nestjs/microservices` (RabbitMQ / amqplib), notifme-sdk, Nunjucks, `@alkemio/notifications-lib`
**Storage**: N/A — the service is a stateless RabbitMQ consumer; no persistence
**Testing**: Jest (`service/`, `npm test`); `lib/` has no test runner — type-checked via `tsc --noEmit`
**Target Platform**: Linux server, Docker container; RabbitMQ consumer microservice
**Project Type**: Two-package monorepo — `lib/` (shared types) + `service/` (NestJS microservice)
**Performance Goals**: N/A — email changes are low-frequency; no new throughput/latency concerns
**Constraints**: Email channel only this release (FR-016); additive library change, no breaking payload changes (FR-013); existing notification flows MUST NOT regress (FR-015 / SC-007)
**Scale/Scope**: 3 events → 3 lib payload types, 3 service email-template payloads, 3 Nunjucks templates, 3 `@EventPattern` handlers, 3 enum members, 2 switch cases × 3. Small, well-bounded; no new infrastructure.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution (`.specify/memory/constitution.md`) is an unpopulated
template — no principles, sections, or governance rules are ratified. There are
therefore no constitutional gates to evaluate.

- **Initial check (pre-Phase 0)**: PASS (vacuous — no gates defined).
- **Post-design re-check (post-Phase 1)**: PASS — the design adds no new
  projects, services, or infrastructure; it extends one existing library and one
  existing service along their established patterns.

No `/speckit.plan` ERROR condition is triggered: there are no gate violations
and all NEEDS CLARIFICATION items are resolved in [research.md](./research.md).

## Project Structure

### Documentation (this feature)

```text
specs/004-email-change-notifications/
├── plan.md              # This file
├── research.md          # Phase 0 — decisions R1–R14
├── data-model.md        # Phase 1 — payload types (wire / normalized / email-template)
├── quickstart.md        # Phase 1 — local validation (RabbitMQ + MailSlurper)
├── contracts/
│   └── events.md        # Phase 1 — the three RabbitMQ event contracts
├── checklists/          # pre-existing
├── spec.md              # feature specification (updated for server-side resolution)
└── tasks.md             # Phase 2 — created by /speckit.tasks (NOT by /speckit.plan)
```

### Source Code (repository root)

```text
lib/                                                 # @alkemio/notifications-lib
├── src/dto/email-change/                                            # NEW directory
│   ├── notification.event.payload.user.email.change.security.signal.ts   # NEW
│   ├── notification.event.payload.user.email.change.new.address.ts       # NEW
│   └── notification.event.payload.user.email.change.global.admin.ts      # NEW
├── src/dto/index.ts                                                 # MODIFIED — export the three
└── package.json                                                     # MODIFIED — additive version bump

service/                                             # alkemio-notifications
├── src/app.controller.ts                                            # MODIFIED — 3 @EventPattern handlers
├── src/generated/alkemio-schema.ts                                  # MODIFIED — 3 NotificationEvent members
├── src/services/notification/
│   ├── notification.service.ts                                      # MODIFIED — cases in both switches; events 1&2 normalization
│   ├── notification.email.payload.builder.service.ts                # MODIFIED — 3 builder methods
│   └── email-template-payload/
│       ├── user.email.change.security.signal.email.payload.ts       # NEW
│       ├── user.email.change.new.address.email.payload.ts           # NEW
│       ├── platform.admin.user.email.change.email.payload.ts        # NEW
│       └── index.ts                                                 # MODIFIED — export the three
├── src/email-templates/                                             # NEW templates
│   ├── user.email.change.security.signal.js                         # NEW
│   ├── user.email.change.new.address.js                             # NEW
│   └── platform.admin.user.email.change.js                          # NEW
└── package.json                                                     # MODIFIED — bump @alkemio/notifications-lib dep
```

**Structure Decision**: No new structure. The feature extends the existing
two-package monorepo along its established conventions — payload DTOs in
`lib/src/dto/<domain>/`, email-template payloads + templates + switch cases in
`service/`. A new `lib/src/dto/email-change/` subfolder groups the three payload
types (per PRD FR-N1). The events-1&2 normalization (research.md §R5) lives at
the `@EventPattern` handler edge so the generic `buildAndSendEmailNotifications`
engine is untouched — protecting the no-regression requirement (FR-015).

## Complexity Tracking

No constitutional violations (no ratified constitution). No new projects,
services, abstractions, or infrastructure are introduced. The one non-trivial
design choice — normalizing the raw payloads of events 1 & 2 at the handler
rather than altering the shared send engine — is the *simpler* option and is
justified in research.md §R5; it requires no entry here.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| _none_ | — | — |

## Dependencies & sequencing notes

- **Library before service**: the `@alkemio/notifications-lib` payload types and
  version bump must land first; the service then builds against the new types.
- **Event 3 server follow-up** (research.md §R13): the service-side handler,
  builder, and template for `USER_EMAIL_CHANGE_GLOBAL_ADMIN_NOTIFICATION` can be
  built and unit-tested now, but end-to-end (Path B) validation is blocked until
  the server publishes that event with a resolved `recipients` array. Events 1
  & 2 (both P1) have no such dependency.
- **`NotificationEvent` enum**: regenerate via `npm run codegen` against a
  server running spec 097, or add the three members manually (research.md §R6).

## Next step

Run `/speckit.tasks` to generate `tasks.md` — the dependency-ordered task
breakdown — from this plan and the Phase 1 artifacts.
