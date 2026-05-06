FROM node:22-alpine

WORKDIR /app

# Install pnpm directly — bypasses corepack entirely (no keyid signature issues)
RUN npm install -g pnpm@8.15.4

# Cache layer: package files change less often than source
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["pnpm", "start"]
