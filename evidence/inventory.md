# Manifest-consumer inventory — `notifications`

workspace#036-distroless-wave-1 · epic alkem-io/infrastructure-operations#2499

## Method — and a warning about how the pre-survey went wrong

The N-apply-paths grep **must be run with `/usr/bin/grep`**, not the shell's `grep`.

In this workspace the interactive shell defines `grep` as a *function* that delegates to
the Claude Code binary with `--ignore-files`, i.e. it honours `.gitignore`. Sibling repos
(`notifications/`, `dev-orchestration/`, `infrastructure-operations/`, …) are **gitignored
at the workspace root** by design. So the "standard" grep run from `~/source/alkemio`
returns **zero** deployment manifests and looks clean:

```
$ grep -rn --include='*.yml' --include='*.yaml' -E '(alkemio/notifications|rg\.nl-ams…)' .
specs/036-distroless-wave-1/repos.yaml:49 …      # spec file only — no manifests at all
```

The same command via the real binary finds every consumer:

```
$ /usr/bin/grep -rn --include='*.yml' --include='*.yaml' -E \
    '(alkemio/notifications|rg\.nl-ams\.scw\.cloud/alkemio/alkemio-notifications)' . \
  | grep -v node_modules | grep -v '/\.git/'
```

This is almost certainly the mechanism behind the pre-survey's "0 in-repo manifests" claim
for this repo — and it is a plausible mechanism for the workspace#026 miss that caused
today's dev outage (server#6335). **Recorded so the next wave does not repeat it.**

## The three live surfaces

| # | Path | Surface | Image ref | Sets command/args/securityContext/probes? | Action |
|---|---|---|---|---|---|
| 1 | `dev-orchestration/01-alkemio-platform/base/alkemio/collaboration-platform/backend/notifications/11-notifications-deployment.yml:21` | dev-orchestration | `rg.nl-ams.scw.cloud/alkemio/alkemio-notifications:5e612c64…` | no `command:`/`args:`/`runAsUser:`/`volumes:`; probes only | **no change needed** — image tag is a git SHA set by CI; no runtime assumptions |
| 2 | `notifications/manifests/25-notifications-deployment-dev.yaml:21` | **in-repo** | `rg.nl-ams.scw.cloud/alkemio/alkemio-notifications:latest` | no `command:`/`args:`/`runAsUser:`/`volumes:`; probes only | **no change needed** — see below |
| 3 | `notifications/manifests/26-notifications-deployment-test.yaml:21` | **in-repo** | `rg.nl-ams.scw.cloud/alkemio/alkemio-notifications:latest` | identical file to #2 (`diff` is empty) | **no change needed** |
| 4 | `infrastructure-operations/orchestration/base/alkemio/collaboration-platform/backend/notifications/11-notifications-deployment.yml:21` | infra-ops (acc/prod) | `alkemio/notifications:v0.36.1` | no `command:`/`args:`/`runAsUser:`/`volumes:`; probes only | **no change needed** — released-version bump is the release train's job |

### Correction to the task file

`tasks/notifications.md` (NOT-1) lists the in-repo manifest as
`notifications/service/manifests/25-notifications-deployment-dev.yaml`.
**There is no `service/manifests/` directory.** The manifests live at the repo root:
`notifications/manifests/`. There are also **two** of them, not one — the task file misses
`26-notifications-deployment-test.yaml`.

So the count is: pre-survey said 0 in-repo manifests, the council said 1, **the truth is 2**
(at a different path than either claimed). The operator's warning that the pre-survey is a
lower bound and "wrong in both directions" held.

### Which workflow applies which manifest

| Workflow | Trigger | Applies |
|---|---|---|
| `build-deploy-k8s-dev-hetzner.yml` | `push: [develop]` | `manifests/25-notifications-deployment-dev.yaml` |
| `build-deploy-k8s-sandbox-hetzner.yml` | `workflow_dispatch` | `manifests/25-notifications-deployment-dev.yaml` |
| `build-deploy-k8s-test-hetzner.yml` | `workflow_dispatch` | `manifests/26-notifications-deployment-test.yaml` |

All three use `Azure/k8s-deploy@v7.0.0` with an `images:` override, so the `:latest` tag in
the YAML is replaced at deploy time by the `${{ github.sha }}` tag. **Merging to `develop`
deploys to Hetzner dev.**

## Semantic-inertness statement

None of the four manifests sets `command:`, `args:`, `securityContext.runAsUser`, `volumes:`,
or shares the image with an `initContainer:`. Every one relies on the image's own
`ENTRYPOINT` + `CMD`, which are unchanged (`/nodejs/bin/node` + `["dist/main.js"]`), and on
port 4004 for its HTTP `/health` readiness+liveness probes, which is unchanged (`EXPOSE 4004`,
verified live: the container logs `Server is listening on port 4004`).

The `nonroot` distroless variant keeps UID 65532 across debian12 → debian13, and all four
`COPY --chown=65532:65532` directives are untouched, so file ownership is unchanged.

**Therefore the base-image swap is semantically inert for all manifest consumers: no manifest
edit is required in any of the three surfaces.**

## Verification commands

```bash
# 1. the inventory itself (use the REAL grep)
/usr/bin/grep -rn --include='*.yml' --include='*.yaml' -E \
  '(alkemio/notifications|rg\.nl-ams\.scw\.cloud/alkemio/alkemio-notifications)' \
  ~/source/alkemio | grep -v node_modules | grep -v '/\.git/' | grep -v worktrees/

# 2. no runtime-shape overrides in any consumer
/usr/bin/grep -nE 'command:|args:|runAsUser|volumes:|initContainer' \
  ~/source/alkemio/notifications/manifests/*.yaml \
  ~/source/alkemio/dev-orchestration/01-alkemio-platform/base/alkemio/collaboration-platform/backend/notifications/*.yml \
  ~/source/alkemio/infrastructure-operations/orchestration/base/alkemio/collaboration-platform/backend/notifications/*.yml
```
