# syntax=docker/dockerfile:1
#
# workspace#036-distroless-wave-1 (epic alkem-io/infrastructure-operations#2499)
#
# Base images are DIGEST-PINNED. Both pins are top-level OCI *index* (manifest
# list) digests, not per-architecture child digests: this image is built
# multi-arch (linux/amd64 + linux/arm64) by .github/workflows/build-release-docker-hub.yml,
# and a child digest would break the arm64 build.
#
# Pins re-resolved 2026-08-05. To re-resolve:
#   docker buildx imagetools inspect node:22.23.2-trixie
#   docker buildx imagetools inspect gcr.io/distroless/nodejs22-debian13:nonroot
# The result must be an `application/vnd.oci.image.index.v1+json` listing BOTH
# linux/amd64 and linux/arm64.
#
# The BUILDER IS DELIBERATELY NON-SLIM: farmhash@3.3.1 (the one native module
# this image ships) publishes prebuilds for linux-x64 only — no linux-arm64 —
# so on the arm64 leg of build-release-docker-hub.yml its install falls
# through to `node-gyp rebuild`, which needs gcc/g++/make/python3. A `-slim`
# builder lacks a C toolchain entirely and breaks that build silently (every
# PR check and the dev deploy build amd64 only, where a prebuild exists, so
# the break surfaces only at GitHub Release publish time). Do not swap this
# to a `-slim`/`-alpine` tag without first confirming an arm64 prebuild
# exists for every native module in dependencies.
#
# Builder/runtime pairing: builder is Debian 13 "trixie" (glibc 2.41) and the
# runtime is distroless debian13 (glibc 2.41) — an exact glibc match for
# farmhash → build/Release/farmhash.node. Node major stays 22, so
# NODE_MODULE_VERSION (127) is unchanged; the debian12 → debian13 runtime
# move is CVE hygiene, not an ABI necessity.
#
# lib-pack stage: builds @alkemio/notifications-lib from source and packs a
# tarball. The service lockfile resolves the lib via a local file path while
# 0.20.0 is pending publication to npm. Once 0.20.0 is on the registry and
# the lockfile is regenerated against it, this stage and its COPY lines in
# the builder/prod-deps stages can be removed.

# ======================
# lib-pack stage (build lib from source, produce the tgz)
# ======================
FROM node:22.23.2-trixie@sha256:97337fb5b20347953eb4b9aa0183c73259a0e21934b07845f04278e4954ae61a AS lib-pack

WORKDIR /lib-src

COPY lib/package*.json ./
RUN npm ci

COPY lib/src ./src
COPY lib/tsconfig*.json ./

RUN npm run build && npm pack

# ======================
# Builder stage (with dev deps)
# ======================
FROM node:22.23.2-trixie@sha256:97337fb5b20347953eb4b9aa0183c73259a0e21934b07845f04278e4954ae61a AS builder

WORKDIR /app

COPY service/package*.json ./
# Supply the packed lib tarball so the lockfile's file: resolution works inside
# the container. The npm install workdir is /app, so file:../lib/... resolves
# to /lib/.
COPY --from=lib-pack /lib-src/alkemio-notifications-lib-*.tgz /lib/
RUN npm ci

COPY service/tsconfig*.json ./
COPY service/src ./src
COPY service/notifications.yml .

RUN npm run build


# ======================
# Prod deps stage (NO dev deps)
# ======================
FROM node:22.23.2-trixie@sha256:97337fb5b20347953eb4b9aa0183c73259a0e21934b07845f04278e4954ae61a AS prod-deps

WORKDIR /app

COPY service/package*.json ./
COPY --from=lib-pack /lib-src/alkemio-notifications-lib-*.tgz /lib/
RUN npm ci --omit=dev && npm cache clean --force


# ======================
# Runtime stage (distroless)
# ======================
FROM gcr.io/distroless/nodejs22-debian13:nonroot@sha256:939d6f1671529d230f50b563578e9b5d206af58f038b10ebd7e1233023d4e167

WORKDIR /app
ENV NODE_ENV=production

COPY --from=prod-deps --chown=65532:65532 /app/node_modules ./node_modules
COPY --from=builder --chown=65532:65532 /app/dist ./dist
COPY --from=builder --chown=65532:65532 /app/src/email-templates ./src/email-templates
COPY --from=builder --chown=65532:65532 /app/notifications.yml ./notifications.yml
COPY --from=builder --chown=65532:65532 /app/package.json ./package.json

EXPOSE 4004
CMD ["dist/main.js"]
