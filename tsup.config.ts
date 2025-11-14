// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/**/*.ts'],
  format: ['esm'], // Build for ES Modules
  dts: true,
  clean: true,
  splitting: false,
  bundle: false, // Crucial: keeps files separate
  sourcemap: false,
  outDir: 'dist',
  target: 'es2020',
  platform: 'neutral',
  // This ensures .js is added to relative imports
  outExtension: ({ format }) => ({ js: '.js' }),
});