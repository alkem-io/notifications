# Implementation Plan: GraphQL-Sourced Notification Email Blacklist

**Branch**: `002-graphql-blacklist` | **Date**: 2025-11-19 | **Spec**: `specs/002-graphql-blacklist/spec.md`
**Input**: Feature specification from `/specs/002-graphql-blacklist/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Replace the existing statically configured notification email blacklist with a dynamically sourced blacklist fetched from the Alkemio GraphQL API. At startup and on a configurable interval (default 5 minutes), the notifications service will query `platform.settings.integration.notificationEmailBlacklist`, normalize and deduplicate the returned addresses, and apply the resulting snapshot atomically to filter outgoing notification recipients; on failures it will retain the last successful snapshot, log errors, and back off retries.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x on Node.js 22.x (service), Node.js 20.x (lib)  
**Primary Dependencies**: NestJS 11, an existing or lightweight GraphQL client helper reused from the notifications service (or implemented under `service/src/core` following existing patterns), and `winston` for logging  
**Storage**: N/A (blacklist is an in-memory snapshot derived from GraphQL; no persistence changes)  
**Testing**: Jest via `npm test` in `service/`, TypeScript build checks in `lib/`  
**Target Platform**: Linux container running the notifications service in Kubernetes
**Project Type**: Backend microservice + shared TypeScript library  
**Performance Goals**: Blacklist sync completes within a few seconds and does not materially affect notification send latency; updates reflected within ≤5 minutes (per SC-001)  
**Constraints**: GraphQL payload limited to 250 entries; service must fail-open on startup if GraphQL is unreachable, retain last-good snapshot on refresh errors, and avoid hammering the API via exponential backoff  
**Scale/Scope**: Single-tenant per deployment (one platform ID per notifications instance); blacklist size expected well under 250 entries

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Alignment with the Alkemio Notifications Constitution (pre-design):

- **Client–server–notifications integration**: This feature does not change notification DTOs or templates; it changes how the service sources configuration controlling delivery. Existing DTOs in `lib/` remain the contract, and blacklist enforcement continues to happen centrally in the notifications service.
- **Structure & tooling**: Implementation will live in `service/src/**` following existing NestJS module patterns and existing configuration mechanisms (e.g., `notifications.yml`, `configuration.ts`), reusing `npm run build`, `npm test`, and `npm run lint` as quality gates. No new runtimes or top-level projects are introduced.
- **Rapid feedback & validation**: We will add Jest tests around the blacklist sync component and its integration with recipient filtering, plus a documented quickstart flow to trigger notifications and verify blacklist behavior in a dev environment.
 - **Rapid feedback & validation**: We will add Jest tests around the blacklist sync component and its integration with recipient filtering, plus a documented quickstart flow to trigger notifications and verify blacklist behavior in a dev environment. End-to-end validation of SC-001/SC-002 will be performed via the external flow described in `specs/002-graphql-blacklist/quickstart.md`.
- **Contracts & compatibility**: No DTO or external AMQP contract changes are required; behavior is backwards compatible with existing static blacklist config via a feature flag / configuration option that can disable GraphQL sync in non-GraphQL environments.
- **Observability & simplicity**: The MVP will use structured logging for sync successes/failures and blacklist application events, with room for metrics in a follow-up iteration (per deferred DR-001/DR-002). The design favors a single in-memory snapshot and a periodic sync job to keep implementation simple and debuggable.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
lib/
└── src/
    └── dto/
        └── ...              # Existing shared DTOs (no changes expected for MVP)

service/
├── src/
│   ├── config/              # Existing configuration loading (extend for GraphQL blacklist toggle/endpoint)
│   ├── core/                # Potential home for a reusable GraphQL client wrapper (if already present)
│   ├── services/
│   │   └── notification/    # Notification orchestration and recipient filtering (where blacklist is applied)
│   └── types/               # Shared internal types (define blacklist snapshot type if needed)
└── test/
    ├── integration/         # End-to-end tests for notification flows (extend for blacklist coverage)
    └── unit/                # Unit tests around blacklist sync and filtering logic
```

**Structure Decision**: Reuse the existing `service/` NestJS microservice structure, adding a dedicated blacklist sync/service module under `service/src/services/notification` or a nearby core module, and updating configuration and tests in place. No new top-level packages or subprojects are introduced.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
