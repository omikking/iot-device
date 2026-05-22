FROM node:20-slim AS deps
WORKDIR /app

RUN npm install -g pnpm

COPY . .

RUN pnpm install --frozen-lockfile --prod=false

# Build
FROM node:20-slim AS build
WORKDIR /app

RUN npm install -g pnpm

RUN apt-get update && apt-get install -y procps

RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY . .
COPY --from=deps /app/node_modules ./node_modules
WORKDIR /app
RUN pnpm --filter @gsp/ui-banshee build
WORKDIR /app/apps/banshee
RUN pnpm build

# Production
FROM node:20-slim AS prod
WORKDIR /app

RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm

COPY --from=build /app/apps/banshee ./apps/banshee
COPY --from=deps /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /app/

EXPOSE 3002
WORKDIR /app/apps/banshee
CMD ["node", "node_modules/next/dist/bin/next", "start"]
