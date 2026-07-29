# Ground Support Platform

Monorepo powered by [Turborepo](https://turbo.build/) and [pnpm workspace](https://pnpm.io/workspaces)

### Apps and Packages

- `web`: [Next.js](https://nextjs.org/) app. The Ground Support Platform web portal.
- `pull-test`: [Next.js](https://nextjs.org/) app. The pull-test client web app.
- `api`: [NestJS](https://nestjs.com/) app. Our primary backend.
- `ui`: a stub React component library shared by `web` & `pull-test`
- `@gsp/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@gsp/typescript-config`: `tsconfig.json`s used throughout the monorepo
- `@gsp/tailwind-config`: `tailwind.config.ts`

### Utilities

- [Tailwind CSS](https://tailwindcss.com/) for styles
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Notices!

> ❗️ 2025-01-10: I have set up the 'concurrently' package to make `pnpm run dev` run both next dev & graphql-types generation on our nextjs projects at the same time. I have not extensively tested this setup. If there is any broken or buggy output, please revert this commit. Then you will have to run `pnpm run dev` as usual, but cd into the web projects and run `pnpm run graphql-types --watch` whenever you are working with graphql in the Nextjs apps. You can find the commit to revert by git blaming this comment. ❗️

## Getting Started

**Prerequisties**

- [UNIX based OS (mac, linux or WSL2 for windows)](https://docs.microsoft.com/en-us/windows/wsl/install)
- [Docker](https://docs.docker.com/get-docker/) to run database containers
- [nvm](https://github.com/nvm-sh/nvm) to install and manage correct node version
- [pnpm](https://pnpm.io/installation) package manager

### Setting up project

```sh
git clone git@github.com:Sandvik-SMR/ground-support-platform.git
cd ground-support-platform
nvm install # Install correct node version from .nvmrc
pnpm install # Install dependencies for all packages
```

#### API app

```sh
cd apps/api
pnpm run prisma:generate # This generates the Prisma client and has to be re-run whenever changes are done to the schema.
cp .env.example .env # Populate with valid values
pnpm run db:dev:up OR docker-compose up dev-db -d# Start Docker Postgres DB (dev)
pnpm run prisma:dev:deploy # Apply Prisma migrations to Docker Postgres DB (dev)
pnpm run db:seed # Populate DB with fake data & test users
pnpm run start:dev # Start NestJS in watch mode
```

> ❗️ All of the services below can be run at the same time by using `pnpm run dev` in the root of project. This is what I recommend so you do not have to go into each project and open a terminal window for each app/package. ❗️

#### Web app

```sh
cd apps/web
cp .env.example .env # Populate with valid values
pnpm run dev
```

#### Pull Test app

```sh
cd apps/pull-test
cp .env.example .env # Populate with valid values
pnpm run dev
```

#### UI Package

```sh
cd packages/ui
pnpm run dev
```

#### Running production builds locally

> ❗️ `pnpm run start` (root) builds and starts the Next.js apps (`web`, `pull-test`, `banshee`) the same way they run in production. `pnpm run preview` (root) builds and previews the Vite testing apps (`test-cyclops`, `test-hydra`, `test-professor`, `test-optic-bolt`). Note that `vite preview` is not a production server, it's only meant for locally verifying a production build, so `pnpm run preview` is for local testing convenience and is not what production deployments of those apps use. ❗️

```sh
pnpm run start   # web, pull-test, banshee
pnpm run preview # test-cyclops, test-hydra, test-professor, test-optic-bolt
```

## Monorepo structure

This repository contains multiple independent apps/packages, each treated as its own individual codebase.

Adding a package should be done within the respective app/package directory. To add axios to the api app, simply `cd apps/api` and run `pnpm add axios`. You could also do `pnpm --filter=@gsp/api add axios` from root. This applies to internal packages as well! So to add our `ui` package to `web` we can simply cd into web and run `pnpm add @gsp/ui`.
