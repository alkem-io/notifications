# Smoke-harness output — notifications (workspace#036-distroless-wave-1)

Run 2026-08-05 against a `--no-cache` build of the committed Dockerfile.
Renamed from `smoke.log` because this repo `.gitignore`s `*.log`.

```
== distroless-image-smoke: alkemio/notifications:036-final ==
PASS: runs as user '65532'
PASS: entrypoint is the distroless node binary
PASS: CMD is ["dist/main.js"]
PASS: no shell / package manager is executable
PASS: no TypeScript sources in the runtime image
PASS: no ts-node / typescript / pnpm in node_modules
PASS: dist/main.js, src/email-templates/, notifications.yml, package.json all present
PASS: farmhash loads and computes (glibc-matched native binary)
PASS: NODE_MODULE_VERSION is 127 (Node 22 ABI unchanged)
NOTE: C3/F1: 'cross-env' present in runtime node_modules = true
NOTE: C3/F1: '@nestjs/cli' present in runtime node_modules = false
PASS: every FROM in the Dockerfile is digest-pinned
IMAGE_DIGEST=sha256:50b49d64f51ffa933d7d1323a7f6d19a18f7e41f7b13d5d5238a065ed821bb82
IMAGE_SIZE_BYTES=97541632
BASELINE_IMAGE_SIZE_BYTES=95523751
SIZE_DELTA_PCT=+2.11
== distroless-image-smoke: ALL CHECKS PASSED ==
```
