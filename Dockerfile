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
# Builder and runtime retain the same Debian 13 and Node 22 pairing.
# Email delivery uses nodemailer directly; unused push providers and their
# native Firebase dependencies are not part of the service runtime.
#
# @alkemio/notifications-lib is consumed from the npm registry (pinned 0.20.0,
# integrity-locked in service/package-lock.json). No local lib build stage is
# needed — the pre-publish lib-pack/tgz bridge was removed once 0.20.0 shipped
# to the registry (workspace#041-callout-reaction-notifications).

# ======================
# Builder stage (with dev deps)
# ======================
FROM node:22.23.4-trixie@sha256:c46850e69b4fab3c4f225aa36b777c8cc001d1cd5b2136e1ea024796f6d3bbbb AS builder

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
FROM node:22.23.4-trixie@sha256:c46850e69b4fab3c4f225aa36b777c8cc001d1cd5b2136e1ea024796f6d3bbbb AS prod-deps

WORKDIR /app

COPY service/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force


# ======================
# Runtime stage (distroless)
# ======================
FROM gcr.io/distroless/nodejs22-debian13:nonroot@sha256:1b90ca047c3a1046ad3527998c747c25b6a88dde91ba8c71b98669d5813aaa21

WORKDIR /app
ENV NODE_ENV=production

COPY --from=prod-deps --chown=65532:65532 /app/node_modules ./node_modules
COPY --from=builder --chown=65532:65532 /app/dist ./dist
COPY --from=builder --chown=65532:65532 /app/src/email-templates ./src/email-templates
COPY --from=builder --chown=65532:65532 /app/notifications.yml ./notifications.yml
COPY --from=builder --chown=65532:65532 /app/package.json ./package.json

EXPOSE 4004
CMD ["dist/main.js"]
