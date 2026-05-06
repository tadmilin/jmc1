### ── Stage 1: build ──────────────────────────────────────────────
FROM node:22.15.0-alpine3.21 AS builder

WORKDIR /app

ARG DATABASE_URI
ARG PAYLOAD_SECRET
ARG NEXT_PUBLIC_SERVER_URL
ARG R2_ACCOUNT_ID
ARG R2_ACCESS_KEY_ID
ARG R2_SECRET_ACCESS_KEY
ARG R2_BUCKET_NAME
ARG R2_BUCKET
ARG CRON_SECRET
ARG PREVIEW_SECRET
ARG PRIVATE_API_KEY

ENV DATABASE_URI=$DATABASE_URI \
    PAYLOAD_SECRET=$PAYLOAD_SECRET \
    NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL \
    R2_ACCOUNT_ID=$R2_ACCOUNT_ID \
    R2_ACCESS_KEY_ID=$R2_ACCESS_KEY_ID \
    R2_SECRET_ACCESS_KEY=$R2_SECRET_ACCESS_KEY \
    R2_BUCKET_NAME=$R2_BUCKET_NAME \
    R2_BUCKET=$R2_BUCKET \
    CRON_SECRET=$CRON_SECRET \
    PREVIEW_SECRET=$PREVIEW_SECRET \
    PRIVATE_API_KEY=$PRIVATE_API_KEY

RUN npm install -g pnpm@8.15.4

COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN npx -y update-browserslist-db@latest
RUN pnpm run build

### ── Stage 2: production runtime ────────────────────────────────
FROM node:22.15.0-alpine3.21 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

RUN npm install -g pnpm@8.15.4

COPY --from=builder --chown=nextjs:nodejs /app ./

RUN rm -rf .git .env .env.* .cursor .claude .vscode

USER nextjs

EXPOSE 3000

CMD ["pnpm", "start"]
