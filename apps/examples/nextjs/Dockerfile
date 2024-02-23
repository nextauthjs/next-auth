# syntax=docker/dockerfile-upstream:master-labs
# Loosely based on Next.js Dockerfile example - https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
FROM node:20-slim AS base

# Install package manager
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  npm i --global --no-update-notifier --no-fund pnpm@latest

USER node

FROM base AS deps
# RUN apk add --no-cache libc6-compat
# RUN apt install libc6-compat
WORKDIR /app

COPY --parents --chown=node:node pnpm-lock.yaml pnpm-workspace.yaml patches ./
COPY --chown=node:node apps/examples/nextjs/package.json ./package.json

RUN echo "package-import-method=copy" > .npmrc
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store pnpm install
# pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

COPY --chown=node:node apps/examples/nextjs ./
COPY --from=deps /app ./

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN pnpm build
RUN rm -rf node_modules src \
  && pnpm -r exec -- rm -rf node_modules

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --chown=node:node --from=builder /app ./

RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store pnpm install --prod
# pnpm install --frozen-lockfile --prod

USER node

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
