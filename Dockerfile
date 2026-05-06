FROM node:22-alpine

WORKDIR /app

# Build args — Railway exposes service variables to Docker build via ARG
# (declared explicitly here; without ARG they're invisible to RUN steps)
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

# Promote build args to env vars so `pnpm run build` (Next.js + Payload) sees them
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

# Install pnpm directly — bypasses corepack (avoids keyid signature failures)
RUN npm install -g pnpm@8.15.4

# Cache layer: lockfile changes less often than source
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["pnpm", "start"]
