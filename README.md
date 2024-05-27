# Ground Support Platform

Monorepo powered by [Turborepo](https://turbo.build/) and [pnpm workspace](https://pnpm.io/workspaces)

### Apps and Packages

- `web`: [Next.js](https://nextjs.org/) app
- `api`: [NestJS](https://nestjs.com/) app
- `ui`: a stub React component library shared by `web`
- `@gsp/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@gsp/typescript-config`: `tsconfig.json`s used throughout the monorepo
- `@gsp/tailwind-config`: `tailwind.config.ts`

### Utilities

- [Tailwind CSS](https://tailwindcss.com/) for styles
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## Getting Started

**Prerequisties**

- [UNIX based OS (mac, linux or WSL2 for windows)](https://docs.microsoft.com/en-us/windows/wsl/install)
- [Docker](https://docs.docker.com/get-docker/) to run database containers
- [pnpm](https://pnpm.io/installation) package manager
- [nvm](https://github.com/nvm-sh/nvm) to install and manage correct node version

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
npx prisma generate # This generates the Prisma client and has to be re-run whenever changes are done to the schema.
cp .env.example .env # Populate with valid values
pnpm run db:dev:up # Start Docker Postgres DB (dev)
pnpm run start:dev # Start NestJS in watch mode
```

#### Web app

```sh
cd apps/web
cp .env.example .env # Populate with valid values
pnpm run dev
```

## Monorepo structure

This repository contains multiple independent apps/packages, each treated as its own individual codebase.

Adding a package should be done within the respective app/package directory. To add axios to the api app, simply `cd apps/api` and run `pnpm add axios`. You could also do `pnpm --filter=@gsp/api add axios` from root. This applies to internal packages as well! So to add our `ui` package to `web` we can simply cd into web and run `pnpm add @gsp/ui`.
