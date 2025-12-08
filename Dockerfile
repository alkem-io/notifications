# =============================================================================
# Stage 1: Build
# =============================================================================
FROM node:22.16.0-alpine AS builder

WORKDIR /usr/src/app

# Copy package files first for better layer caching
COPY ./service/package*.json ./

# Install all dependencies (devDependencies needed for build)
RUN npm ci

# Copy source files needed for build
COPY ./service/src ./src
COPY ./service/tsconfig.json .
COPY ./service/tsconfig.build.json .
COPY ./service/nest-cli.json .

ENV NODE_ENV=production

# Build the application, then prune devDependencies
RUN npm run build \
    && npm prune --omit=dev \
    && npm cache clean --force

# =============================================================================
# Stage 2: Production
# =============================================================================
FROM gcr.io/distroless/nodejs22-debian12:nonroot

WORKDIR /usr/src/app

# Copy only necessary artifacts from builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY ./service/notifications.yml ./notifications.yml

EXPOSE 4004

# Distroless uses the nodejs binary directly, not shell
CMD ["dist/main.js"]
