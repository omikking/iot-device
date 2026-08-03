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

WORKDIR /app/apps/test-cyclops
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

COPY --from=build /app/apps/test-cyclops ./apps/test-cyclops
COPY --from=deps /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /app/

EXPOSE 3011
WORKDIR /app/apps/test-cyclops
CMD ["node", "node_modules/next/dist/bin/next", "start"]

# to build the image - docker build -t pull-test:1.0.0 -f apps/pull-test/Dockerfile .
# to run the image - docker run -d --name pull-test-container -p 3001:3001 pull-test:1.0.0
