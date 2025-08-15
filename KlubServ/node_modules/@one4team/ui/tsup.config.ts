import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'use-sync-external-store'],
  treeshake: true,
  minify: true,
  injectStyle: false,
  outDir: 'dist',
  target: 'es2020',
  platform: 'browser',
  esbuildOptions(options) {
    options.jsx = 'automatic'
  }
}) 