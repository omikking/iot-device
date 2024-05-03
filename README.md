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
