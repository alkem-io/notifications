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
# @alkemio/notifications-lib is consumed from the npm registry (pinned 0.20.0,
# integrity-locked in service/package-lock.json). No local lib build stage is
# needed — the pre-publish lib-pack/tgz bridge was removed once 0.20.0 shipped
# to the registry (workspace#041-callout-reaction-notifications).

# ======================
# Builder stage (with dev deps)
# ======================
FROM node:22.23.2-trixie@sha256:2082d2bf902c8835655c6bcfee3594c00ea900498a9f6e2b96d3352536f9e8d8 AS builder

WORKDIR /app

COPY service/package*.json ./
RUN npm ci

COPY service/tsconfig*.json ./
COPY service/src ./src
COPY service/notifications.yml .

RUN npm run build


# ======================
# Prod deps stage (NO dev deps)
# ======================
FROM node:22.23.2-trixie@sha256:2082d2bf902c8835655c6bcfee3594c00ea900498a9f6e2b96d3352536f9e8d8 AS prod-deps

WORKDIR /app

COPY service/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force


# ======================
# Runtime stage (distroless)
# ======================
FROM gcr.io/distroless/nodejs22-debian13:nonroot@sha256:4e4fb0ce55fd73901600796ef079a9490369d2515d7da31633a91608c82ca13b

WORKDIR /app
ENV NODE_ENV=production

COPY --from=prod-deps --chown=65532:65532 /app/node_modules ./node_modules
COPY --from=builder --chown=65532:65532 /app/dist ./dist
COPY --from=builder --chown=65532:65532 /app/src/email-templates ./src/email-templates
COPY --from=builder --chown=65532:65532 /app/notifications.yml ./notifications.yml
COPY --from=builder --chown=65532:65532 /app/package.json ./package.json

EXPOSE 4004
CMD ["dist/main.js"]
