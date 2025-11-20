# Copilot Coding Agent Instructions

## Overview

- **Repository purpose**: This repo provides Alkemio's out-of-band notifications system.
  - `service/`: NestJS microservice that receives events (via AMQP/RabbitMQ), builds email payloads and sends notifications.
  - `lib/`: TypeScript library exposing shared DTOs, enums and types for notifications events used by the service and external clients.
- **Tech stack**:
  - Node.js (Volta pin: `service` uses Node `22.16.0`, `lib` uses Node `20.15.1`). Use Node >= 22 for the service; Node 20 also works for the lib.
  - TypeScript 5.8, NestJS 11, Jest, ESLint 9, Prettier 3.
  - Dockerfile at repo root builds the notifications service (CI builds and deploys containers from this).
- **Size / layout**: Small monorepo with two Node projects:
  - Root: `Dockerfile`, top-level `README.md`, `.travis.yml`, `.github/workflows/*.yml` (CI/CD), `package-lock.json` (primarily for `service/`).
  - `service/`: main application.
  - `lib/`: shared types-only library.

Always prefer working inside `service/` for backend changes and `lib/` for DTO / event contract tweaks.

## Project Layout & Key Files

- **Root**
  - `Dockerfile`: builds the NestJS notifications service for container deployment.
  - `README.md`: high-level description of service & library.
  - `.travis.yml`: legacy CI (Travis) config; reference only.
  - `.github/workflows/*.yml`: GitHub Actions for building & deploying Docker images to Hetzner and Docker Hub.
- **Service (`service/`)**
  - `package.json`: main scripts (`build`, `test`, `lint`, `start`, etc.), Jest config entry points.
  - `tsconfig.json`: TypeScript config; path aliases (`@src/*`, `@core/*`, etc.).
  - `src/main.ts`: NestJS bootstrap entrypoint.
  - `src/app.module.ts`: root NestJS module.
  - `src/health.controller.ts`: basic health endpoint.
  - `src/config/*`: configuration, logging, aliases.
  - `src/services/notification/notification.service.ts`: central notification orchestration (switch over events → decide email template + payload builder call).
  - `src/services/notification/notification.email.payload.builder.service.ts`: single service that maps event payloads to email template payloads.
  - `src/services/notification/email-template-payload/**`: per-notification TypeScript interfaces for data passed into email templates.
  - `src/email-templates/**.js`: Nunjucks email templates (transactional layout, per-domain templates).
  - `src/generated/alkemio-schema.ts`: generated GraphQL schema/types.
  - `graphql/userLookup.graphql`: GraphQL document used for codegen.
  - `test/config/jest.config.js` and `test/config/jest.config.ci.js`: Jest configs for local and CI test runs.
  - `eslint.config.js` + `.eslintignore`: ESLint 9 flat config (note `.eslintignore` is deprecated but still referenced).
- **Library (`lib/`)**
  - `package.json`: scripts (`build`, `lint`), Node engines, Volta pin to Node 20.
  - `tsconfig.json` / `tsconfig.prod.json`: TypeScript config for building the library.
  - `src/index.ts`: library entrypoint.
  - `src/dto/**`: notification event payload types grouped by domain (`space/`, `platform/`, `organization/`, `user/`, etc.).
  - `README.md`: short description of the library.

When adding new notifications:
- Define the event payload in `lib/src/dto/<domain>/...` and export it from the relevant `index.ts`.
- Define the email template payload under `service/src/services/notification/email-template-payload/<domain>...`.
- Add a method to `notification.email.payload.builder.service.ts` and cases to `notification.service.ts` for payload mapping and template selection.
- Create the template under `service/src/email-templates/` and wire it in `notification.service.ts` as described in `service/README.md`.

## Tooling & Runtime Versions

- **Node / npm**
  - `service/package.json` specifies `engines.node >= 22.16.0` and Volta `node: 22.16.0`.
  - `lib/package.json` specifies `engines.node >= 20.0.0` and Volta `node: 20.15.1`.
  - Use Node 22.x for all service work; Node 20–22 work for lib.
- **Key CLIs**
  - `nest` (via `@nestjs/cli` dev dependency — use `npm run` scripts instead of global CLI when possible).
  - `jest` (via `npm test`).
  - `eslint` 9 flat config (service and lib).

If commands fail due to missing CLIs, prefer using `npm run <script>` from the appropriate directory rather than global installs.

## Install / Bootstrap

Always install dependencies per package before building or testing.

- **Service**
  - From repo root:
    - `cd service`
    - `npm install`
  - Observed behavior:
    - Succeeds on Node 22 with peer-dependency and deprecation warnings (GraphQL and Apollo packages), but no fatal errors.

- **Library**
  - From repo root:
    - `cd lib`
    - `npm install`
  - Observed behavior:
    - Succeeds on Node 20/22 with some deprecation warnings; no fatal errors.

Do **not** run `npm install` at repo root; dependencies are scoped to `service/` and `lib/`.

## Build, Test, Lint & Run

Always follow this order when validating code changes:
1. Install deps (`npm install` in `service/` and/or `lib/`).
2. Build.
3. Run tests.
4. Run lint (being aware of known issues in `lib/`).

### Service (`service/`)

- **Build**
  - Command (from `service/`):
    - `npm run build`
  - Internals: `prebuild` runs `rimraf dist`, then `nest build` compiles TypeScript into `dist/`.
  - Observed: completes successfully in a few seconds on Node 22.

- **Test**
  - Command (from `service/`):
    - `npm test`
  - Uses Jest config at `test/config/jest.config.js`.
  - Observed: all suites pass (`2 passed`), execution ~5–6 seconds.
  - Warnings: `ts-jest` warns about `.js` email-template files without `allowJs`; tests still pass. Do **not** "fix" this unless you intentionally update Jest/TS config; just note the warning.
  - CI coverage scripts: `npm run test:ci` and `npm run test:ci:coverage` use the CI Jest config and feed coverage into Coveralls.

- **Lint**
  - Command (from `service/`):
    - `npm run lint`
  - Internals: `tsc --noEmit` then `eslint src/**/*.ts{,x}` using `eslint.config.js`.
  - Observed: succeeds with a warning about `.eslintignore` deprecation (ESLint 9). Treat this as noise, not a failure.
  - For auto-fix: `npm run lint:fix`.
  - For production lint (NODE_ENV=production): `npm run lint:prod`.

- **Run application**
  - Standard run (compiled):
    - Ensure `npm run build` has been executed.
    - `npm run start:prod` (runs `node dist/main`).
  - Development mode (watch):
    - `npm run start:dev` (Nest watch mode).
  - Debug mode:
    - `npm run start:debug` (debug port `9230`).
  - Direct TS execution with hot reload:
    - `npm run start-nodemon`
    - Or with `.env`: `npm run start-nodemon-local`.
  - Quickstart support services (for manual end-to-end test with mailslurper):
    - `npm run start:services` (uses `quickstart-mailslurper.yml` docker compose file).

### Library (`lib/`)

- **Build**
  - Command (from `lib/`):
    - `npm run build`
  - Internals: `tsc --project tsconfig.prod.json` after `rimraf dist`.
  - Observed: completes successfully.

- **Lint**
  - Command (from `lib/`):
    - `npm run lint`
  - Internals: `tsc --noEmit && eslint src/**/*.ts{,x}`.
  - Observed: **currently fails** with ESLint 9 complaining that it "couldn't find an eslint.config.(js|mjs|cjs) file".
    - There is no flat `eslint.config.*` in `lib/` yet; only `eslint` dev dependencies are configured.
    - Treat this as a known issue; do **not** attempt to "fix" by adding a config unless a task explicitly asks to adjust linting for the library.
  - Workaround for validation: rely on `tsc --noEmit` (first half of the script) by running `npx tsc --noEmit` or `npm run build` to ensure typing is valid.

## Docker & CI Workflows

- **Dockerfile (root)**
  - Builds the notifications service container using `service/` source.
  - Used by:
    - `.github/workflows/build-release-docker-hub.yml` (tags images and pushes to Docker Hub on release).
    - `.github/workflows/build-deploy-k8s-*-hetzner.yml` (builds and deploys to Hetzner clusters).
  - For local image build from repo root:
    - `docker build -f Dockerfile . -t alkemio/notifications:local`

- **GitHub Actions CI/CD**
  - `build-release-docker-hub.yml`:
    - Trigger: `release.published`.
    - Steps:
      - Checkout.
      - Compute image tags based on branch/tag.
      - Set up QEMU/Buildx.
      - Login to Docker Hub.
      - `docker/build-push-action` to build and push the image.
  - `build-deploy-k8s-dev-hetzner.yml`:
    - Trigger: `push` to `develop`.
    - Steps: Docker login to private registry, `docker build` of root Dockerfile, push two tags (commit SHA and `latest`), configure kubeconfig from secrets, `kubectl` apply secret, then deploy with `Azure/k8s-deploy` using `service/manifests/25-notifications-deployment-dev.yaml`.
  - `build-deploy-k8s-test-hetzner.yml` and `build-deploy-k8s-sandbox-hetzner.yml`:
    - Trigger: `workflow_dispatch` (manual).
    - Same pattern as dev, but using environment-specific kubeconfig secrets.

For local validation before opening a PR:
- Always ensure `npm run build`, `npm test`, and `npm run lint` succeed in `service/`.
- Optionally run `npm run build` in `lib/` to ensure DTO changes compile.
- Do **not** attempt to replicate k8s deployment steps locally.

## Known Quirks & Gotchas

- **ESLint in `lib/`**: `npm run lint` fails due to missing `eslint.config.js` under ESLint 9. This is expected for now. Rely on TypeScript build/`tsc --noEmit` to validate library changes unless explicitly modifying lint setup.
- **Jest `ts-jest` warnings**: The service tests produce warnings about `.js` email template files being compiled by `ts-jest`. Ignore unless specifically tasked to refactor test config.
- **`.eslintignore` deprecation warning**: Services' lint run prints an `ESLintIgnoreWarning` about `.eslintignore` being deprecated. This is a warning only.
- **Multiple Node versions**: The repo uses Volta fields per package. Pick Node 22.x and keep it consistent when running service scripts; Node 20/22 both work for the library. Avoid mixing very old Node versions.

## How to Work Effectively in This Repo

- When implementing features or fixes:
  - If you are changing notification behavior (events, payloads, templates), touch **both** `lib/` (DTOs) and `service/` (builder, service, templates) as per `service/README.md`.
  - Use the existing domain structure (`space/`, `platform/`, `organization/`, `user/`, etc.) and follow naming patterns from similar notifications.
  - Keep new TypeScript code aligned with the existing NestJS patterns (modules, providers, services).

- Before finalizing a PR:
  - From `service/` run, in this order:
    1. `npm install` (if not already done).
    2. `npm run build`.
    3. `npm test`.
    4. `npm run lint`.
  - From `lib/` (only if you changed DTOs or types):
    1. `npm install` (if not already done).
    2. `npm run build` (and optionally `npx tsc --noEmit` for additional type checking).
    3. **Skip** `npm run lint` or expect it to fail with the known ESLint configuration error; do not treat this as a regression.

- For manual end-to-end local testing of email delivery:
  - Start supporting services (from `service/`): `npm run start:services`.
  - Run the service (`npm run start:dev` or `npm run start:prod`).
  - Follow the steps in `service/README.md` (publishing messages to RabbitMQ and checking mailslurper).

## Guidance for Copilot Coding Agent

- Trust these instructions as the source of truth for build, test, lint and run commands.
- Prefer using the documented commands and sequences rather than searching for alternatives.
- Only search the codebase or configuration files if:
  - You need file-specific context for a feature you are asked to modify, **or**
  - A documented command fails in a way that clearly indicates configuration drift (e.g., missing script or renamed file).
- When in doubt about where to implement a change:
  - **Service behavior / runtime logic** → `service/src/**` (NestJS controllers, services, config).
  - **Notification event shapes / DTOs** → `lib/src/dto/**` and corresponding exports.
  - **Email content / appearance** → `service/src/email-templates/**` and associated email-payload interfaces.

Following these conventions should minimize CI failures and reduce time spent on exploration and trial-and-error with bash commands.