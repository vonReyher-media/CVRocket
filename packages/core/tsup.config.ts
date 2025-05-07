import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true, // Generate .d.ts files
  sourcemap: true,
  clean: true, // Clean dist before build
  outDir: 'dist',
  minify: false, // Optional, depending on use
  target: 'esnext',
  external: ['react', 'react-dom'],
  tsconfig: 'tsconfig.json',
});
