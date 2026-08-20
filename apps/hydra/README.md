# Hydra

Consumer-facing Next.js 14 (App Router) portal in the Ground Support Platform monorepo. Runs on **port 3003**.

> Not to be confused with [apps/test-hydra](../test-hydra), which is a Web Bluetooth PWA for technicians on port 3012. The two apps are unrelated.

This is a **barebones scaffold**: auth, routing, the data layer and styling are wired up, with no business logic yet.

## Getting started

```sh
cp .env.example .env.local          # then fill in NEXTAUTH_SECRET
pnpm --filter @gsp/ui-core build    # required once: styles.css is a build artifact
pnpm --filter hydra dev
```

The API must already be running on `:3333` — `dev` runs `graphql-codegen --watch` alongside `next dev` and codegen fails loudly without it.

## Conventions

Same as the other portals — see [.github/instructions/nextjs-apps.instructions.md](../../.github/instructions/nextjs-apps.instructions.md). Two deliberate differences:

- **No Tailwind prefix.** `tailwind.config.ts` follows `apps/web`: `content: ['./src/**/*.tsx']`, no `prefix`, and it does not scan `packages/ui-core/src`. App code writes plain Tailwind (`flex`, `p-4`); the `ds-` prefix belongs to `@gsp/ui-core`, whose classes arrive via its prebuilt `dist/index.css`.
- **`NEXT_PUBLIC_API_URL` is the bare API origin** (no `/graphql`), matching banshee. `UrqlProvider` and `codegen.ts` both append `/graphql`.

## Access control

[src/middleware.ts](src/middleware.ts) is **default-deny**: any path with a `[companyId]` segment requires the caller to hold a `UserPermission` for that exact company whose `appsAccess` includes `Application.HYDRA`. `Role.SANDVIK_ADMIN` bypasses the check, mirroring the API's `RolesGuard`. Only genuinely company-agnostic top-level routes are listed in `COMPANY_AGNOSTIC_SEGMENTS`.

To grant a non-admin user access:

1. Give the company an active `HYDRA` plan (re-seeding does this for Gold Mining Corp; otherwise add it via the admin portal on `:3000`).
2. Tick Hydra in that user's company permissions in the web portal on `:3000`.

Without both, the user is redirected to `/not-found` — that is the middleware working as intended.
