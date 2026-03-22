# Stage 1: deps
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
COPY package.json package-lock.json* ./
RUN npm ci --frozen-lockfile

# Stage 2: builder
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
# Generate Prisma client for the target platform
RUN npx prisma generate

# Stage 3: runner
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

RUN mkdir -p /app/uploads && chown nestjs:nodejs /app/uploads

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json
# Include Prisma schema and generated client
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma 2>/dev/null || true

USER nestjs

EXPOSE 3001
ENV PORT=3001

CMD ["node", "dist/main"]
