import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // ✅ Local alias to the core source code
      '@cvrocket/core': path.resolve(__dirname, '../../packages/core/src'),
    },
  },
});
