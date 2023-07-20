import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  minify: 'terser',
  format: ['esm', 'cjs'],
  dts: true,
});
