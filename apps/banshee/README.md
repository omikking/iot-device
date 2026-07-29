# Banshee

Banshee is the Next.js application for managing Banshee bolt-load measurement requests, scheduling, templates, and dashboards on the Ground Support Platform.

It is a workspace app (`apps/banshee`) inside the GSP monorepo and consumes shared UI from [`@gsp/ui-banshee`](../../packages/ui-banshee/README.md).

## Getting Started

Create the environment variables file and populate the fields.

```sh
cp .env.example .env
# Populate with values
```

Then, run the development server:

```sh
pnpm --filter=banshee dev
# or if in directory
pnpm dev
```

Run the development server without GraphQL type generation:

```sh
pnpm dev:next
```

Generate GraphQL TypeScript types:

```sh
pnpm graphql-types --watch
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the pages by modifying files under `src/app/(routes)/[companyId]/...`. The page auto-updates as you edit.

## Scripts

| Script                   | What it does                                                |
| ------------------------ | ----------------------------------------------------------- |
| `pnpm dev`               | Runs `next dev` and `graphql-codegen --watch` concurrently. |
| `pnpm dev:next`          | Runs only the Next.js dev server (port 3000).               |
| `pnpm dev:graphql-types` | Runs only the GraphQL codegen in watch mode.                |
| `pnpm build`             | Production build via `next build`.                          |
| `pnpm start`             | Starts the production server on port 3000.                  |
| `pnpm lint`              | Runs `next lint`.                                           |
| `pnpm type-check`        | Runs `tsc --noEmit`.                                        |

## Project Structure

```
apps/banshee/
├── codegen.ts                 # GraphQL codegen config
├── next.config.js             # Next.js + SVGR webpack config
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (routes)/[companyId]/
│   │   │   ├── banshee/       # Banshee list + per-unit configuration & dashboard
│   │   │   ├── cart/          # Order cart and submission
│   │   │   ├── contactUs/
│   │   │   ├── design-banshee/
│   │   │   ├── overview/      # Company-level overview
│   │   │   ├── scheduler/     # Scheduling new/recurring measurements
│   │   │   ├── siteInformation/
│   │   │   └── template/      # Banshee templates
│   │   ├── api/auth/          # next-auth handlers
│   │   ├── layout.tsx
│   │   └── uitexts/           # Centralised user-facing strings
│   ├── components/            # App-specific React components
│   ├── gql/                   # Generated GraphQL types & documents (do not edit)
│   ├── libs/                  # Hooks, providers, utilities
│   └── components/schemas/    # Zod schemas for forms
└── tailwind.config.ts
```

## Tech Stack

- [Next.js 14 (App Router)](https://nextjs.org/docs)
- [React 18](https://react.dev/)
- [urql](https://commerce.nearform.com/open-source/urql/) for GraphQL
- [next-auth](https://next-auth.js.org/) for authentication
- [react-hook-form](https://react-hook-form.com/) + [zod](https://zod.dev/) for forms & validation
- [Tailwind CSS](https://tailwindcss.com/) (with the `ui-banshee-` prefix — see UI package README)
- Shared design system: [`@gsp/ui-banshee`](../../packages/ui-banshee/README.md)

## GraphQL Codegen

GraphQL operations live alongside the components/pages that use them and are generated into `src/gql/` by `graphql-codegen`. Run `pnpm graphql-types` (or `pnpm dev:graphql-types` to watch) after adding or changing a query/mutation. Files inside `src/gql/` are generated — do not edit by hand.

## UI Components

Banshee **must not** import from `@gsp/ui` directly. The Tailwind classes in `@gsp/ui` are unprefixed and won't render correctly inside this app. All shared components are re-implemented (or wrapped) in [`@gsp/ui-banshee`](../../packages/ui-banshee/README.md) with the `ui-banshee-` Tailwind prefix.

```ts
import { Button, LoadingSpinner, Text } from '@gsp/ui-banshee';
```

## Loading States

For consistent UX across pages, use the shared `LoadingSpinner` from `@gsp/ui-banshee` inside a centered flex wrapper rather than ad-hoc text-only loaders:

```tsx
{
  fetching && (
    <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-gap-3">
      <LoadingSpinner />
      <Text variant="medium" color="muted">
        Loading...
      </Text>
    </div>
  );
}
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [urql Documentation](https://commerce.nearform.com/open-source/urql/docs/)

## Deploy

Banshee is deployed as part of the Ground Support Platform infrastructure. Refer to the platform-level deployment docs in the repository root for environment-specific details.
