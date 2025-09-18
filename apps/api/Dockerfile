FROM node:20-slim AS deps
WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/

RUN pnpm install --frozen-lockfile --prod=false

# Build (generate + compile)

FROM node:20-slim AS build
WORKDIR /app

RUN npm install -g pnpm

RUN apt-get update && apt-get install -y \
    procps \
    openssl \
    ca-certificates \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY . .
COPY --from=deps /app/node_modules ./node_modules

WORKDIR /app/apps/api

RUN pnpm prisma generate 
RUN pnpm build

# Production (slim runtime)

FROM node:20-slim AS prod
WORKDIR /app

RUN npm install -g pnpm

RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# RUN pnpm install --frozen-lockfile --prod --filter api...

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY . .

COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/prisma ./apps/api/prisma

EXPOSE 3333
WORKDIR /app/apps/api
CMD ["node", "dist/src/main.js"]

# to build the image - docker build -t my-api:1.0.0 -f apps/api/Dockerfile .
# to run the image - docker run -d --name api-container -p 3333:3333 my-api:1.0.0