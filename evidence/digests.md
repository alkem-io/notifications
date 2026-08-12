# Digest pins — notifications (workspace#036-distroless-wave-1)

Re-resolved **2026-08-05** at implementation time. Any digest recorded in
`spec.md` / `plan.md` predates this and was NOT reused.

## What is pinned

**Corrected 2026-08-06** (drift-gate fix commit): the builder pin below was originally
`node:22.23.2-trixie-slim`, which broke the arm64 leg of `build-release-docker-hub.yml` —
`farmhash@3.3.1` ships prebuilds for `linux-x64` only, so arm64 falls through to
`node-gyp rebuild`, and `-slim` carries no C toolchain. Reverted to non-slim `trixie`, which
retains gcc/g++/make/python3. See "Builder choice" below for the corrected reasoning.

| stage | before | after |
|---|---|---|
| builder | `node:22.23.2-bookworm` (floating) | `node:22.23.2-trixie@sha256:a566dd560283ae5615c8bb86b58fa8a1b6f3c82b492473a061672416266625da` |
| prod-deps | `node:22.23.2-bookworm` (floating) | *(same pin as builder)* |
| runtime | `gcr.io/distroless/nodejs22-debian12:nonroot` (floating) | `gcr.io/distroless/nodejs22-debian13:nonroot@sha256:939d6f1671529d230f50b563578e9b5d206af58f038b10ebd7e1233023d4e167` |

## Both pins are manifest-list (OCI index) digests

This repo builds **multi-arch** — `.github/workflows/build-release-docker-hub.yml` builds
`linux/amd64` and `linux/arm64` natively on separate runners and stitches the digests into a
manifest list. A per-architecture child digest would break the arm64 build, so both pins are
top-level indexes:

```
$ docker buildx imagetools inspect node:22.23.2-trixie
MediaType: application/vnd.oci.image.index.v1+json
Digest:    sha256:a566dd560283ae5615c8bb86b58fa8a1b6f3c82b492473a061672416266625da
  Platform: linux/amd64 · linux/arm64/v8 · linux/ppc64le · linux/s390x

$ docker buildx imagetools inspect gcr.io/distroless/nodejs22-debian13:nonroot
MediaType: application/vnd.oci.image.index.v1+json
Digest:    sha256:939d6f1671529d230f50b563578e9b5d206af58f038b10ebd7e1233023d4e167
  Platform: linux/amd64 · linux/arm64/v8 · linux/arm/v7 · linux/s390x · linux/ppc64le
```

Both list `linux/amd64` **and** `linux/arm64`, as required.

> **Correction to the task file.** `tasks/notifications.md` (NOT-2, and the operator brief)
> states this slice is `linux/amd64` only. It is **not**: `build-release-docker-hub.yml`
> publishes a two-arch manifest list to Docker Hub. Getting this wrong would have meant
> pinning a child digest and breaking the arm64 release build.

## Builder choice: trixie, not bookworm — and why the task file said otherwise

`tasks/notifications.md` (NOT-2) instructs keeping a **bookworm** builder, on the premise that
this repo's Volta pin is **22.16.0** and `node:22.16.0-trixie-slim` does not exist (trixie tags
start at 22.22.0).

That premise is **stale**. The repo is now on Node **22.23.2**:

```
$ grep -A2 '"volta"' service/package.json
  "volta": { "node": "22.23.2" }
$ grep -n "node-version" .github/workflows/ci-*.yml
  node-version: '22.23.2'
```

and `node:22.23.2-trixie-slim` **does** exist (resolved above). So the constraint that forced a
mismatched pairing is gone, and the builder moves to trixie — giving an **exact glibc match**
(2.41 builder / 2.41 runtime) rather than the "backward-compatible but mismatched" 2.36 → 2.41
pairing the task file settles for.

**No Volta/Node version was changed.** 22.23.2 is what the repo already pins; ruling C3's
principle (don't smuggle a version bump into a base-image swap) is respected — the tag simply
follows the existing pin.

### Corrected: the builder is deliberately NON-slim

The implementation originally moved `-bookworm` → `-trixie-slim` as a size win, reasoning that
`farmhash` installs a **prebuilt** binary rather than compiling. That reasoning was measured on
**amd64 only** and does not hold on arm64:

```
$ npm view farmhash@3.3.1 dist.tarball    # published prebuild manifest
$ curl -sL https://github.com/lovell/farmhash/releases/download/v3.3.1/... | tar tz
  linux-x64.tar.gz   linuxmusl-x64.tar.gz   darwin-arm64.tar.gz   darwin-x64.tar.gz
  win32-ia32.tar.gz  win32-x64.tar.gz
```

**No `linux-arm64` prebuild exists.** On the arm64 leg of
`build-release-docker-hub.yml` (native `ubuntu-24.04-arm` runner), `prebuild-install` therefore
falls through to `node-gyp rebuild`, which requires `gcc`/`g++`/`make`/`python3` — exactly the
toolchain `-slim` removes:

```
$ docker run --rm node:22.23.2-trixie-slim sh -c 'which cc gcc g++ make'
NO C TOOLCHAIN
```

This was invisible in every check that ran before the drift-gate re-review: CI and the dev
deploy both build **amd64 only**, where the prebuild exists. The break would have surfaced for
the first time at GitHub Release publish. The amd64-only "prebuilt, no toolchain needed"
observations above remain true *for amd64* and are kept for that record, but the builder tag
they were used to justify has been reverted to non-slim `trixie`, which retains the toolchain.
Verified: `docker buildx build --platform linux/arm64 .` completes successfully against the
current (non-slim) Dockerfile.

## ABI statement

The debian12 → debian13 runtime move is **CVE hygiene, not an ABI necessity**:

- Node major stays **22**, so `NODE_MODULE_VERSION` is unchanged at **127** — asserted by the
  smoke harness (`PASS: NODE_MODULE_VERSION is 127`).
- glibc is backward-compatible, so even the original bookworm-built (2.36) module would load on
  trixie (2.41). Moving the builder to trixie makes them identical, which is strictly stronger.
- **On amd64**, the native artifact is a prebuilt binary requiring only `GLIBC_2.2`:

  ```
  $ strings -a farmhash.node | grep -oE 'GLIBC_[0-9]+\.[0-9]+' | sort -uV
  GLIBC_2.2
  $ file farmhash.node
  ELF 64-bit LSB shared object, x86-64 … dynamically linked, stripped
  ```

  so on amd64 it is never linked against the builder's glibc at all (downloaded, not
  compiled), and the builder/runtime glibc relationship carries no risk there.
- **On arm64 this does NOT hold**: no `linux-arm64` prebuild exists for farmhash@3.3.1, so
  `node-gyp rebuild` compiles the module against the *builder's* glibc, which is then loaded by
  the distroless runtime. Here the exact 2.41/2.41 pairing (non-slim `trixie` builder / debian13
  runtime) IS load-bearing, not belt-and-braces — an arm64 build with a mismatched glibc pair
  would be a genuine ABI risk this wave exists to avoid.
- Proven empirically, not just argued: `farmhash` loads and computes inside the final amd64
  image (`hash32('abc') = 3330671702`), the full NestJS app boots and listens on 4004, and a
  `docker buildx build --platform linux/arm64` of the current Dockerfile completes successfully.

## Re-resolution

```bash
docker buildx imagetools inspect node:22.23.2-trixie
docker buildx imagetools inspect gcr.io/distroless/nodejs22-debian13:nonroot
```

The result must be `application/vnd.oci.image.index.v1+json` listing both `linux/amd64` and
`linux/arm64`. **Do not resolve `-trixie-slim`** — see "Builder choice" above; the builder must
keep its C toolchain for the arm64 leg. The same instruction is in the Dockerfile header.
