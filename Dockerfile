# ======================
# Builder stage (with dev deps)
# ======================
FROM node:22.16.0-bookworm AS builder

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
FROM node:22.16.0-bookworm AS prod-deps

WORKDIR /app

COPY service/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force


# ======================
# Runtime stage (distroless)
# ======================
FROM gcr.io/distroless/nodejs22-debian12

WORKDIR /app
ENV NODE_ENV=production

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder  /app/dist ./dist
COPY --from=builder  /app/notifications.yml ./notifications.yml
COPY --from=builder  /app/package.json ./package.json

EXPOSE 4004
CMD ["dist/main.js"]
