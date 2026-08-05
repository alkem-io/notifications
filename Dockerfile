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
#   docker buildx imagetools inspect node:22.23.2-trixie-slim
#   docker buildx imagetools inspect gcr.io/distroless/nodejs22-debian13:nonroot
# The result must be an `application/vnd.oci.image.index.v1+json` listing BOTH
# linux/amd64 and linux/arm64.
#
# Builder/runtime pairing: builder is Debian 13 "trixie" (glibc 2.41) and the
# runtime is distroless debian13 (glibc 2.41) — an exact glibc match for the one
# native module this image ships (farmhash → build/Release/farmhash.node).
# Node major stays 22, so NODE_MODULE_VERSION (127) is unchanged; the
# debian12 → debian13 runtime move is CVE hygiene, not an ABI necessity.

# ======================
# Builder stage (with dev deps)
# ======================
FROM node:22.23.2-trixie@sha256:a566dd560283ae5615c8bb86b58fa8a1b6f3c82b492473a061672416266625da AS builder

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
FROM node:22.23.2-trixie@sha256:a566dd560283ae5615c8bb86b58fa8a1b6f3c82b492473a061672416266625da AS prod-deps

WORKDIR /app

COPY service/package*.json ./
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
