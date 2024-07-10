import { defineConfig, type Options } from 'tsup';

export default defineConfig((options: Options) => ({
  entry: ['./src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  external: ['react'],
  // tsconfig: './tsconfig.json',
  // splitting: false,
  ...options,
}));
