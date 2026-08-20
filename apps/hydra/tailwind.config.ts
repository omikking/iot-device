// tailwind config is required for editor support

import type { Config } from 'tailwindcss';
import sharedConfig from '@gsp/tailwind-config';

// Deliberately modelled on apps/web, NOT apps/banshee:
//   * no `prefix` — Hydra's own app code writes plain Tailwind (`flex`, `p-4`)
//   * `content` does not scan packages/ui-core/src — Hydra consumes the
//     package's prebuilt, `ds-`-prefixed dist/index.css instead (imported in
//     src/app/layout.tsx). Run `pnpm --filter @gsp/ui-core build` at least once.
const config: Pick<Config, 'content' | 'presets'> = {
  content: ['./src/**/*.tsx'],
  presets: [sharedConfig],
};

export default config;
