# Digest pins — notifications (workspace#036-distroless-wave-1)

Re-resolved **2026-08-05** at implementation time. Any digest recorded in
`spec.md` / `plan.md` predates this and was NOT reused.

## What is pinned

| stage | before | after |
|---|---|---|
| builder | `node:22.23.2-bookworm` (floating) | `node:22.23.2-trixie-slim@sha256:db8a96a63e5264607ada2d206758876ebbed6a12be2ada7517793cbfb0c2a29c` |
| prod-deps | `node:22.23.2-bookworm` (floating) | *(same pin as builder)* |
| runtime | `gcr.io/distroless/nodejs22-debian12:nonroot` (floating) | `gcr.io/distroless/nodejs22-debian13:nonroot@sha256:939d6f1671529d230f50b563578e9b5d206af58f038b10ebd7e1233023d4e167` |

## Both pins are manifest-list (OCI index) digests

This repo builds **multi-arch** — `.github/workflows/build-release-docker-hub.yml` builds
`linux/amd64` and `linux/arm64` natively on separate runners and stitches the digests into a
manifest list. A per-architecture child digest would break the arm64 build, so both pins are
top-level indexes:

```
$ docker buildx imagetools inspect node:22.23.2-trixie-slim
MediaType: application/vnd.oci.image.index.v1+json
Digest:    sha256:db8a96a63e5264607ada2d206758876ebbed6a12be2ada7517793cbfb0c2a29c
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

`-bookworm` → `-trixie-slim` is also a size win on the builder stage (`-slim` drops the C/C++
toolchain). That is safe here because `farmhash` installs a **prebuilt** binary via
`prebuild-install` rather than compiling. Verified three ways in the `prod-deps` stage:

```
$ ls -la /app/node_modules/farmhash/build/Release/
-rwxr-xr-x 1 root root 56400 Apr 17  2024 farmhash.node   # 2024 mtime = downloaded, not built
$ find /app/node_modules/farmhash -name '*.o' | wc -l
0                                                        # no compile objects
$ which gcc g++ make python3
(none)                                                   # -slim has NO C toolchain at all
```

The third point is the decisive one: had npm needed to compile, the `-slim` build would have
**failed**, not silently degraded.

## ABI statement

The debian12 → debian13 runtime move is **CVE hygiene, not an ABI necessity**:

- Node major stays **22**, so `NODE_MODULE_VERSION` is unchanged at **127** — asserted by the
  smoke harness (`PASS: NODE_MODULE_VERSION is 127`).
- glibc is backward-compatible, so even the original bookworm-built (2.36) module would load on
  trixie (2.41). Moving the builder to trixie makes them identical, which is strictly stronger.
- **The glibc question turns out to be moot for this repo.** The single native artifact is a
  prebuilt binary that requires only `GLIBC_2.2`:

  ```
  $ strings -a farmhash.node | grep -oE 'GLIBC_[0-9]+\.[0-9]+' | sort -uV
  GLIBC_2.2
  $ file farmhash.node
  ELF 64-bit LSB shared object, x86-64 … dynamically linked, stripped
  ```

  Since it is never linked against the *builder's* glibc at all (it is downloaded, not
  compiled), the builder/runtime glibc relationship carries no risk here in either direction.
  The exact 2.41/2.41 match is belt-and-braces, not a load-bearing fix.
- Proven empirically, not just argued: `farmhash` loads and computes inside the final image
  (`hash32('abc') = 3330671702`), and the full NestJS app boots and listens on 4004.

## Re-resolution

```bash
docker buildx imagetools inspect node:22.23.2-trixie-slim
docker buildx imagetools inspect gcr.io/distroless/nodejs22-debian13:nonroot
```

The result must be `application/vnd.oci.image.index.v1+json` listing both `linux/amd64` and
`linux/arm64`. The same instruction is in the Dockerfile header.
