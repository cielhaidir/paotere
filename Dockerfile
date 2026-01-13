# syntax=docker.io/docker/dockerfile:1
ARG BUN_VERSION=latest

FROM oven/bun:${BUN_VERSION} AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY prisma ./prisma
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Generate Prisma client for Linux
RUN bunx prisma generate

RUN bun run build

# Production image, copy all the files and run next
FROM oven/bun:${BUN_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 --gid nodejs --home /home/nextjs --create-home nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Create upload directories and set permissions
RUN mkdir -p /app/public/uploads /app/public/assets && \
    chown -R nextjs:nodejs /app/public/uploads /app/public/assets

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Install only required global packages
RUN bun add -g prisma

# Create bun cache directory for nextjs user
RUN mkdir -p /home/nextjs/.bun && chown -R nextjs:nodejs /home/nextjs

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["bun", "server.js"]

# CMD ["node", "server.js"]

