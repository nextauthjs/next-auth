# syntax=docker/dockerfile-upstream:master-labs

# Loosely based on Next.js Dockerfile example - https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
FROM node:20-slim AS base

# Install package manager
RUN --mount=type=cache,id=pnpm-auth-store,target=/root/.pnpm-store \
  npm i --global --no-update-notifier --no-fund pnpm@latest

USER node

## DEPENDENCIES
FROM base AS deps
WORKDIR /app

# Copy over package.json and lock files
# - "--parents" flag required otherwise copying "patches" only copies the contents
#   of that directory, and not the directory itself. This requires the syntax
#   directive at the top of the file.
COPY --parents --chown=node:node pnpm-lock.yaml pnpm-workspace.yaml patches ./
COPY --chown=node:node apps/examples/nextjs-docker/package.json ./package.json

# Avoid 'cross-device link not permitted' error with pnpm install
RUN echo "package-import-method=copy" > .npmrc

# Install dependencies
RUN --mount=type=cache,id=pnpm-auth-store,target=/root/.pnpm-store pnpm install

## BUILDER
FROM base AS builder
WORKDIR /app

# Copy code from the examples app
COPY --chown=node:node apps/examples/nextjs-docker ./
# Copy dependencies from deps stage
COPY --from=deps /app ./

# ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build the "standalone" Next.js version
RUN pnpm build
# Remove node_modules
RUN rm -rf node_modules

## RUNNER
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# ENV NEXT_TELEMETRY_DISABLED 1

# Copy everything from builder stage
COPY --chown=node:node --from=builder /app ./

# Install only prod dependencies
RUN --mount=type=cache,id=pnpm-auth-store,target=/root/.pnpm-store pnpm install --prod
RUN --mount=type=cache,id=pnpm-auth-store,target=/root/.pnpm-store pnpm install -w sharp

USER node
EXPOSE 3000
ENV PORT 3000

# Run the built project
CMD ["pnpm", "exec", "next", "start"]
