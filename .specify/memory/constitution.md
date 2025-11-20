<!--
Sync Impact Report
- Version change: 0.0.0 → 1.0.0
- Modified principles:
	- [none, initial creation]
- Added sections:
	- Core Principles
	- Delivery Flow & Constraints
	- Development Workflow & Quality Gates
	- Governance
- Removed sections:
	- [none]
- Templates status:
	- ✅ Updated: .specify/templates/plan-template.md (Constitution Check description)
	- ✅ Updated: .specify/templates/spec-template.md (no changes required, aligned)
	- ✅ Updated: .specify/templates/tasks-template.md (parallel/user-story guidance aligned)
- Deferred TODOs:
	- TODO(RATIFICATION_DATE): Original ratification date unknown; set when first agreed by team.
-->

# Alkemio Notifications Constitution

## Core Principles

### I. Client–Server–Notifications Integration (NON-NEGOTIABLE)

All notification work MUST preserve and strengthen the integration between
client applications, platform backend services, and this notifications
service/library.

- Client → backend → notifications flows MUST be explicitly modeled as
	contracts using shared DTOs in `lib/`.
- The notifications service MUST be the single place where email payloads
	and templates are assembled, using the existing NestJS modules under
	`service/src/services/notification` and `service/src/email-templates`.
- Any change to notification shape in a client or backend MUST be reflected
	in `lib/src/dto/**` and kept in sync with the payload builder and
	templates.
- Cross-service changes MUST include at least one end-to-end validation path
	(e.g., API call or message published → email render) before merge.

**Rationale**: Alkemio relies on consistent, traceable communication between
clients, platform services, and out-of-band notifications. Centralizing
contracts and flows prevents drift and broken emails.

### II. Established Structure & Tooling First

All implementation MUST align with the existing repository structure, NestJS
service patterns, and tooling documented in `.github/copilot-instructions.md`
and `service/README.md`.

- New notifications MUST reuse `lib/` for DTOs and `service/` for delivery,
	avoiding parallel frameworks or ad-hoc scripts.
- Tooling commands (`npm run build`, `npm test`, `npm run lint`, Docker
	workflows) MUST be the default path; new tools or scripts require explicit
	justification in the PR.
- Module layout, naming, and patterns for new notifications MUST follow
	existing notification handlers, payload builders, and email templates.
- Any deviation from established patterns MUST be documented in the plan
	and spec and approved in review.

**Rationale**: Consistent structure and tooling reduce cognitive load,
accelerate onboarding, and make rapid notification delivery safer.

### III. Rapid Feedback & Validation Loops

Notification delivery work MUST be organized to produce fast, repeatable
feedback from both automated checks and human review.

- For each change, the minimal executable flow (from triggering event to
	rendered email) MUST be defined and exercised locally (or in a dev
	environment) before merge.
- `service` commands for build, test, and lint MUST be run for any change in
	runtime logic; `lib` MUST at least compile successfully for DTO changes.
- Where feasible, tests SHOULD be added or updated to cover new
	notification flows (payload builder mapping, template rendering, and
	integration happy-path).
- Plans and specs MUST describe how a reviewer or QA can trigger the
	notification and what success looks like.

**Rationale**: Rapid, reliable feedback loops keep notification delivery
fast without sacrificing correctness.

### IV. Contract-Driven Development & Backwards Compatibility

Changes to notifications MUST be driven by explicit contracts and preserve
backwards compatibility wherever possible.

- DTOs in `lib/src/dto/**` define the canonical contract between client,
	backend, and notifications service; they MUST be updated before or
	alongside implementation.
- When a contract change is backwards incompatible, the change MUST be
	versioned (e.g., new DTO or new event) and coordinated with dependent
	services and clients.
- Breaking changes MUST include a migration/rollout plan in the spec and
	plan (including deprecation strategy where applicable).
- Integration points (AMQP messages, GraphQL queries, REST endpoints)
	MUST be documented and, where practical, covered by tests.

**Rationale**: Explicit contracts and careful evolution avoid silent
breakages across client, server, and notifications.

### V. Observability, Simplicity & Operability

Notification flows MUST be observable, understandable, and operable in
production while remaining as simple as possible.

- Notification-related logs MUST provide enough context to trace a message
	from triggering event to email dispatch (IDs, event type, template).
- New flows MUST prefer configuration and existing extension points over
	new infrastructure or patterns.
- Error handling MUST favor clear, actionable errors and avoid hiding
	failures in background tasks without logging.
- Performance considerations (e.g., batching, retries) MUST be explicitly
	noted in the plan/spec when they impact deliverability or latency.

**Rationale**: Simple, observable flows are faster to debug and safer to
iterate on, which directly supports rapid notification delivery.

## Delivery Flow & Constraints

This project is a notifications microservice plus shared library that
integrates with the wider Alkemio platform.

- Client applications and backend services communicate domain events using
	DTOs from `lib/`, and send them via AMQP/RabbitMQ or other platform
	channels into the notifications service.
- The notifications service maps these events into email payloads using
	`notification.email.payload.builder` services and renders them via
	Nunjucks templates under `service/src/email-templates`.
- Docker and Kubernetes manifests define how the service is built and
	deployed; changes MUST respect existing CI/CD workflows.
- Any new notification type MUST document:
	- Triggering event (where it originates).
	- DTO shape in `lib/`.
	- Payload builder mapping in `service/`.
	- Template(s) used and expected recipients.
	- How to trigger it in a dev environment for validation.

**Constraints**:

- Do not introduce new top-level projects or runtimes without an approved
	rationale.
- Do not bypass `lib/` for shared types between services and notifications.
- Do not couple templates directly to client-specific behavior; keep them
	driven by DTOs and payload builders.

## Development Workflow & Quality Gates

Feature work and fixes MUST follow a workflow that keeps the
client–server–notifications integration coherent and tested.

- Each significant change MUST start with a feature spec and plan under
	`specs/` created via the relevant `/speckit.*` commands.
- The "Constitution Check" gate in `plan.md` MUST confirm alignment with
	the principles above (integration, structure/tooling, feedback loops,
	contracts, observability).
- Tasks in `tasks.md` MUST be organized by user story and flow, and SHOULD
	include at least one task that validates the end-to-end notification
	path.
- Pull requests MUST describe which notifications are affected, how they
	were validated (commands, environments), and which DTOs/contracts were
	touched.
- Before merge, reviewers MUST verify:
	- DTO and implementation changes are consistent.
	- Build, tests, and lint have been run where applicable.
	- At least one manual or automated end-to-end validation was executed.

**Rationale**: A lightweight but explicit workflow keeps changes flowing
quickly while maintaining quality.

## Governance

This constitution defines how notification work is structured, validated,
and integrated within the Alkemio platform.

- **Supremacy**: When in conflict, these principles supersede ad-hoc
	practices or personal preferences in notification-related work.
- **Amendments**:
	- Proposals to change principles or governance MUST be made via PR that
		updates this file and references concrete motivations and examples.
	- Version numbers MUST follow semantic versioning:
		- MAJOR: Backwards-incompatible governance or principle changes.
		- MINOR: New principles or materially expanded guidance.
		- PATCH: Clarifications, wording, or non-semantic refinements.
	- Each amendment MUST include an updated Sync Impact Report comment at
		the top of this file.
- **Compliance**:
	- All `/speckit.plan` and `/speckit.tasks` outputs MUST respect this
		constitution.
	- Reviewers are responsible for enforcing constitutional gates on PRs
		related to notifications.
	- Exceptions MUST be explicitly recorded in the spec/plan and, where
		long-lived, reflected in a future amendment.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): Original
ratification date unknown; set when first agreed by team. | **Last Amended**:
2025-11-18
