# Multi-stage build for One4Team monorepo
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the applications
RUN npm run build

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built applications
COPY --from=builder /app/Apps/web/.next/standalone ./
COPY --from=builder /app/Apps/web/.next/static ./Apps/web/.next/static
COPY --from=builder /app/Apps/api/dist ./Apps/api/dist
COPY --from=builder /app/packages/ui/dist ./packages/ui/dist

# Copy package files
COPY --from=builder /app/Apps/web/package.json ./Apps/web/package.json
COPY --from=builder /app/Apps/api/package.json ./Apps/api/package.json
COPY --from=builder /app/packages/ui/package.json ./packages/ui/package.json

# Copy environment files
COPY --from=builder /app/env.example ./.env

USER nextjs

EXPOSE 3000 4000

ENV PORT 3000
ENV API_PORT 4000

# Start the applications
CMD ["npm", "run", "start:prod"] 