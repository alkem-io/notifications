# Implementation Plan: Community Poll Notification Emails

**Branch**: `003-poll-notifications` | **Date**: 2026-03-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-poll-notifications/spec.md`

## Summary

Add four new poll-related notification event types to the Alkemio notifications service. Each event follows the established notification pipeline: event payload DTO in `lib/`, email template payload interface, payload builder method, Nunjucks email template, and switch-case registration in the notification service. No new infrastructure or dependencies are required — this is a pure extension of the existing notification pattern across all layers.

## Technical Context

**Language/Version**: TypeScript 5.8, Node.js 22.x (service), Node.js 20.x (lib)
**Primary Dependencies**: NestJS 11, notifme-sdk, Nunjucks, amqplib (RabbitMQ)
**Storage**: N/A (stateless event processing)
**Testing**: Jest
**Target Platform**: Linux server (Docker)
**Project Type**: Monorepo (service + lib)
**Performance Goals**: N/A (inherits existing throughput characteristics)
**Constraints**: Must follow existing notification patterns exactly; no new dependencies
**Scale/Scope**: 4 new notification event types following an established pattern

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution is not yet configured (template placeholders only). No gates to enforce. Proceeding with standard project conventions from CLAUDE.md.

**Post-design re-check**: N/A — no constitution constraints defined.

## Project Structure

### Documentation (this feature)

```text
specs/003-poll-notifications/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── event-payloads.md
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
lib/src/dto/space/
├── notification.event.payload.space.poll.vote.cast.on.own.poll.ts          # NEW
├── notification.event.payload.space.poll.vote.cast.on.poll.i.voted.on.ts   # NEW
├── notification.event.payload.space.poll.modified.on.poll.i.voted.on.ts    # NEW
├── notification.event.payload.space.poll.vote.affected.by.option.change.ts # NEW
├── poll.payload.ts                                                          # NEW
└── index.ts                                                                 # MODIFIED

service/src/services/notification/
├── notification.service.ts                        # MODIFIED (2 switch cases × 4 events)
├── notification.email.payload.builder.service.ts  # MODIFIED (4 new builder methods)
└── email-template-payload/
    ├── space.poll.vote.cast.email.payload.ts      # NEW (shared by vote events)
    ├── space.poll.modified.email.payload.ts        # NEW (shared by modify/affect events)
    └── index.ts                                    # MODIFIED

service/src/email-templates/
├── space.collaboration.poll.vote.cast.on.own.poll.js                  # NEW
├── space.collaboration.poll.vote.cast.on.poll.i.voted.on.js           # NEW
├── space.collaboration.poll.modified.on.poll.i.voted.on.js            # NEW
└── space.collaboration.poll.vote.affected.by.option.change.js         # NEW
```

**Structure Decision**: This feature extends the existing monorepo structure. New files are added alongside existing space-domain notifications in both `lib/` and `service/`. No new directories are created beyond what already exists.

## Complexity Tracking

No violations — this feature follows the established notification pattern exactly without introducing new abstractions or dependencies.
