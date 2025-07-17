# Base configuration
ARG node_tag=22-alpine
FROM node:${node_tag} AS base
WORKDIR /app

# Install dependencies and build
FROM base AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install pnpm globally and set environment variables
RUN corepack enable && \
    export COREPACK_DEFAULT_TO_LATEST=0

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml .npmrc ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm install --frozen-lockfile --shamefully-hoist && \
  pnpm cache clean

# Copy source code and build
COPY . .

# Generate Prisma client (after source code is copied)
RUN pnpm dlx prisma generate

# Build Nuxt application
RUN --mount=type=cache,id=nuxt,target=/app/node_modules/.cache/nuxt/.nuxt \
  pnpm run build

# Final production container
FROM base AS runtime
ENV NODE_ENV=production

WORKDIR /app
EXPOSE 3000

# Add a non-root user and switch to it
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

HEALTHCHECK --retries=10 --start-period=5s \
  CMD wget --no-verbose --spider http://0.0.0.0:3000/ || exit 1

# Copy build output and Prisma client from builder
COPY --from=builder /app ./

# Default command
CMD ["node", ".output/server/index.mjs"]
