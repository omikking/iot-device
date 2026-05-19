# Banshee Design System (`@gsp/ui-banshee`)

`@gsp/ui-banshee` is the React component library used exclusively by the [Banshee](../../apps/banshee/README.md) application within the Ground Support Platform monorepo. It mirrors the patterns of [`@gsp/ui`](../ui/README.md) but ships its own Tailwind classes prefixed with `ui-banshee-` so it can coexist with other apps' design systems without class collisions.

We use [shadcn/ui](https://ui.shadcn.com/) and [Radix Primitives](https://www.radix-ui.com/primitives) as the foundation.

## Why a separate package from `@gsp/ui`?

- The Banshee app cannot import from `@gsp/ui` directly because the unprefixed Tailwind classes there would silently fail to render inside Banshee's prefixed Tailwind environment.
- A dedicated package gives Banshee a curated subset of components, charts, icons, and hooks tuned to its UX without affecting other apps.

## Getting Started

Run the dev build (Tailwind in watch mode, regenerates `dist/index.css`):

```sh
# From this package
pnpm dev

# From repo root, only this package
pnpm --filter=@gsp/ui-banshee dev

# From repo root, all dev services (recommended)
pnpm run dev
```

Build the compiled stylesheet once:

```sh
pnpm build
```

## Scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` | Tailwind watcher → emits `dist/index.css`. |
| `pnpm build` | One-shot Tailwind build → emits `dist/index.css`. |
| `pnpm lint` | ESLint over `src/`. |
| `pnpm type-check` | `tsc --noEmit`. |

## Consuming the package

In Banshee:

```ts
import {
  Button,
  Form,
  LoadingSpinner,
  Modal,
  SidebarInset,
  Text,
  // ...
} from '@gsp/ui-banshee';
```

Import the compiled stylesheet once (already wired in Banshee's root layout):

```ts
import '@gsp/ui-banshee/styles.css';
```

The `.tsx` source is consumed directly by Next.js via `transpilePackages`, so there is no JS build step — only the CSS is precompiled.

## Project Structure

```
packages/ui-banshee/
├── src/
│   ├── components/
│   │   ├── base/         # Buttons, inputs, dialogs, tables, spinner, etc.
│   │   ├── charts/       # ECharts/Recharts wrappers
│   │   ├── sidebar/      # App sidebar
│   │   ├── svg/          # Icon components
│   │   └── index.ts      # Barrel — re-exports every public component
│   ├── hooks/            # use-mobile, use-tablet, ...
│   ├── images/
│   ├── lib/utils.ts      # cn(), escapeHtml()
│   ├── styles.css        # Tailwind entry (compiled to dist/index.css)
│   ├── types/
│   └── index.ts          # Public package entry
├── tailwind.config.ts    # prefix: 'ui-banshee-'
└── package.json
```

## Tailwind Prefix

This package uses a Tailwind class prefix to keep its styles isolated:

```ts
// tailwind.config.ts
{
  prefix: 'ui-banshee-',
  // ...
}
```

That means every utility must be written with the prefix:

```tsx
<div className="ui-banshee-flex ui-banshee-items-center ui-banshee-gap-3">
  <LoadingSpinner />
  <Text variant="medium" color="muted">Loading...</Text>
</div>
```

Components inside this package already use the prefix internally (see e.g. `loading-spinner.tsx` using `ui-banshee-animate-spin`).

## Adding a new component

1. Pick the component you want from [shadcn/ui](https://ui.shadcn.com/docs/components) (or build one from scratch / Radix).
2. Drop it under `src/components/base/<component>.tsx`.
3. Use the local `cn()` from `../../lib/utils` for class merging.
4. Prefix every Tailwind utility with `ui-banshee-`.
5. Re-export it from `src/components/index.ts` so it is reachable via `@gsp/ui-banshee`.

Example minimal component:

```tsx
'use client';
import { cn } from '../../lib/utils';

export const MyBadge = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      'ui-banshee-inline-flex ui-banshee-items-center ui-banshee-rounded-md ui-banshee-bg-neutral-2 ui-banshee-px-2 ui-banshee-py-0.5',
      className,
    )}
    {...props}
  />
);
```

Then in `src/components/index.ts`:

```ts
export * from './base/my-badge';
```

## Building Strategy

Like `@gsp/ui`, the `.tsx` files are consumed directly by Next.js using `transpilePackages` in the consumer's `next.config.js`. Only `styles.css` → `dist/index.css` is precompiled by Tailwind. This keeps the package simple and lets a single `tailwind.config.ts` drive both the package and the app.

## Notes

- Don't import from `@gsp/ui` here — keep the two design systems independent.
- Components should be reusable, accessible (Radix-backed where applicable), and free of app-specific business logic.
- App-level state, data fetching, and routing belong in the Banshee app, not in this package.
