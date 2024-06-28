# Ground Support Platform Design System

The Ground Support Platform Design System is a collection of React components. This package is designed to provide a consistent look and feel across applications within the platform.

## Building process for `packages/ui`

The `packages/ui` is a set of UI components that are compiled into the `dist` directory. The `.tsx` files are directly consumed by the Next.js apps using `transpilePackages` in `next.config.js`. This approach was chosen for the following reasons:

- Simplifies sharing of a single `tailwind.config.js` across apps and packages.
- Simplifies package compilation by relying only on the Next.js Compiler and `tailwindcss`.
- Prevents Tailwind classes from overwriting each other by using a `ui-` prefix for classes in the `ui` package.
- Ensures clear package export boundaries.

## Alternative Building Strategy

An alternative strategy is to consume `packages/ui` directly from the source without building. If we choose this strategy, we will have to update the `tailwind.config.js` in our apps to include our package locations. This ensures that all usages of the `tailwindcss` class names are found for CSS compilation.

For example, in [tailwind.config.js](packages/tailwind-config/tailwind.config.js):

```js
  content: [
    // app content
    `src/**/*.{js,ts,jsx,tsx}`,
    // include packages if not transpiling
    "../../packages/ui/*.{js,ts,jsx,tsx}",
  ],
```

## How to add a component from ShadCN

Choose what component you want in [text](https://ui.shadcn.com/docs/components)
Scroll down to installation. Choose CLI, click pnpm and copy the link.
For example: pnpm dlx shadcn-ui@latest add button

Open the component in packages/ui/src/component/button
Add the component you want to export in './index.ts', for example: export \* from './button';

Import the component you want to use, example:
import { Button } from '@gsp/ui';

Use it in the TSX, example:
<Button variant={'secondary'} onClick={() => signIn()}>
Sign in
</Button>
