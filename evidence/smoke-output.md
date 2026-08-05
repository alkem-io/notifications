# Smoke-harness output — notifications (workspace#036-distroless-wave-1)

Re-run **2026-08-06** (drift-gate fix commit) against a `--no-cache` build of the CURRENT
committed Dockerfile (builder reverted to non-slim `trixie`) and the CURRENT smoke harness
(lstat-based shell/package-manager probe). The prior transcript recorded a run against a
superseded (`-slim`) builder image using a superseded (exit-status) probe — a PASS string that
line no longer matches — and has been replaced wholesale, per drift-gate finding
notifications-driftfix-spec-compliance-3.

```
== distroless-image-smoke: alkemio/notifications:036-final ==
PASS: runs as user '65532'
PASS: entrypoint is the distroless node binary
PASS: CMD is ["dist/main.js"]
PASS: no shell / package manager present on the filesystem
PASS: no TypeScript sources in the runtime image
PASS: no ts-node / typescript / pnpm in node_modules
PASS: dist/main.js, src/email-templates/, notifications.yml, package.json all present
PASS: farmhash loads and computes (glibc-matched native binary)
PASS: NODE_MODULE_VERSION is 127 (Node 22 ABI unchanged)
NOTE: C3/F1: 'cross-env' present in runtime node_modules = true
NOTE: C3/F1: '@nestjs/cli' present in runtime node_modules = false
PASS: every FROM in the Dockerfile is digest-pinned
IMAGE_DIGEST=sha256:064a1489fbd6ca2c3687c014212ab70345d666dfb2b83cda9212576fc039d23c
IMAGE_SIZE_BYTES=97581056
BASELINE_IMAGE_SIZE_BYTES=95523751
SIZE_DELTA_PCT=+2.15
== distroless-image-smoke: ALL CHECKS PASSED ==
```
