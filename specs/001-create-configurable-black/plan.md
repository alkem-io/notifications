# Implementation Plan: Configurable Email Blacklist for Notifications

**Branch**: `001-create-configurable-black` | **Date**: 2025-11-18 | **Spec**: `specs/001-create-configurable-black/spec.md`
**Input**: Feature specification from `/specs/001-create-configurable-black/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add a configurable, global blacklist of exact email addresses that must never receive notifications from the Alkemio notifications service. The blacklist will be provided via existing configuration mechanisms, applied centrally in the email sending pipeline after recipient resolution, and enforced consistently across all notification types. Blacklisted recipients will be filtered out before handoff to the email transport, with clear logging/metrics so operations can observe blocked sends and diagnose issues when users report missing emails.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: Node.js 22.x (service), Node.js 20–22 (lib)  
**Primary Dependencies**: NestJS 11 (service), TypeScript 5.8, Nunjucks email templates, existing notification services in `service/src/services/notification`  
**Storage**: N/A (blacklist stored via configuration only; no persistent DB changes)  
**Testing**: Jest (service tests via `npm test`), TypeScript compiler checks for `lib` and `service`  
**Target Platform**: Linux server (Docker/Kubernetes deployment as per existing manifests)
**Project Type**: Backend notifications microservice + shared TypeScript DTO library  
**Performance Goals**: Negligible additional latency for blacklist checks; per-notification blacklist evaluation should be O(N) in number of recipients and cheap relative to existing processing  
**Constraints**: Must not introduce new runtime services or storage; must work within existing config and deployment flows; feature must be safe-by-default (fail-open vs fail-closed behavior documented). Fail-open vs fail-closed behavior for v1: if blacklist configuration is missing or invalid, the system will **fail-open** (treat the blacklist as empty and log a warning) to avoid blocking all notifications due to configuration mistakes. Blacklist evaluation itself must not cause email sends to fail; failures in blacklist parsing are surfaced via logs only.  
**Scale/Scope**: Intended to support all notifications emitted by the service, with blacklist size expected to be small-to-moderate (dozens to low hundreds of email addresses) in typical deployments

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Confirm this feature aligns with the Alkemio Notifications Constitution:

- Client–server–notifications integration is explicitly modeled via `lib/`
  DTOs and corresponding service/template changes where needed. For this
  feature, the core behavior (blacklist enforcement) lives in the service
  and does not require contract changes unless we later decide to expose
  blacklist state via events or APIs.
- Implementation follows existing structure and tooling in `service/` and
  `lib/` (no ad-hoc scripts or parallel frameworks). Blacklist checks will
  be implemented as a small, testable service/component in
  `service/src/services/notification` and wired into the existing
  notification orchestration flow.
- Rapid feedback and validation loops are defined: local Jest tests in
  `service/` will cover blacklist behavior; end-to-end validation will use
  existing quickstart flows (RabbitMQ + mailslurper) to verify that
  blacklisted addresses never receive emails while others do.
- Contract changes will be avoided for v1; if any DTO additions are later
  required (for audit or configuration), they will be added in `lib/src/dto/**`
  and rolled out according to backwards-compatibility guidelines.
- Observability and simplicity are central: blacklist configuration is
  provided via existing config, and log entries/metrics will clearly label
  when a recipient was skipped due to the blacklist.

## Project Structure

### Documentation (this feature)

```text
specs/001-create-configurable-black/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
lib/
  src/
    dto/
      # No DTO changes expected for v1; if later required,
      # new or extended DTOs will be added here.

service/
  src/
    config/
      configuration.ts          # Extend to expose blacklist config (e.g. array of emails)
    services/
      notification/
        notification.service.ts # Wire blacklist checks into recipient processing
        # Potential new file for blacklist logic, e.g.:
        # notification.blacklist.service.ts
    # Existing email templates remain unchanged; blacklist operates at
    # recipient selection/sending layer, not per-template.

  test/
    # Add/extend unit and integration tests around notification service
    # to cover blacklist behavior.
```

**Structure Decision**: Reuse the existing `lib/` and `service/` layout. Implement blacklist logic as a dedicated component/service under `service/src/services/notification` and configure it via `service/src/config/configuration.ts`, without introducing new top-level projects or directories.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
